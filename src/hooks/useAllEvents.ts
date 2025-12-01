import { useState, useEffect, useCallback } from 'react';
import type { Event, CreateEventPayload, UpdateEventPayload, UpdateEventWebsiteDetailsPayload, WebsitePayload } from '@/types/eventTypes';
import { useAuth } from '@/context/AuthContext';
import { firestore } from '@/services/firebaseConfig';
import { isValidSlug } from '@/utils/eventUrlUtils';
import { 
  collection, getDocs, query, orderBy, Timestamp, where,
  doc, addDoc, updateDoc, serverTimestamp, FieldValue, getDoc, setDoc, deleteDoc
} from 'firebase/firestore'; 
import { getEventStatus } from '@/pages/admin/adminEventColumns'; // Import status helper

const EVENTS_COLLECTION = 'events'; // Firestore collection name for events
const WEBSITE_SUBCOLLECTION = 'website'; // Subcollection for website details
const WEBSITE_DOC_ID = 'details'; // Document ID for website details within the subcollection

export interface GroupedEvents {
  upcoming: Event[];
  ongoing: Event[];
  completed: Event[];
  cancelled: Event[]; // Assuming 'cancelled' is an explicit status
  other: Event[]; // For events that don't fit or have no status
}

export const useAllEvents = () => {
  const { currentUser, isAdmin } = useAuth(); // For checking admin role
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents>({
    upcoming: [],
    ongoing: [],
    completed: [],
    cancelled: [],
    other: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllEvents = useCallback(async () => {
    if (!currentUser || !isAdmin) {
      setError(new Error("Permission denied. You do not have access to this resource."));
      setIsLoading(false);
      setAllEvents([]);
      setGroupedEvents({ upcoming: [], ongoing: [], completed: [], cancelled: [], other: [] });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const eventsCollectionRef = collection(firestore, EVENTS_COLLECTION);
      const q = query(eventsCollectionRef, orderBy("date", "desc")); // Order by event date
      const querySnapshot = await getDocs(q);
      
      const fetchedEvents = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        const event = {
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          // Calculate status if not explicitly set
          status: data.status || getEventStatus(data.date, data.endDate),
        } as Event;
        return event;
      });
      setAllEvents(fetchedEvents);

      // Group events
      const groups: GroupedEvents = { upcoming: [], ongoing: [], completed: [], cancelled: [], other: [] };
      fetchedEvents.forEach(event => {
        const status = event.status || 'other'; // Default to 'other' if no status
        if (groups[status]) {
          groups[status].push(event);
        } else {
          groups.other.push(event); // Fallback for unexpected statuses
        }
      });
      setGroupedEvents(groups);

    } catch (e) {
      console.error("Failed to fetch all events:", e);
      setError(e instanceof Error ? e : new Error('Failed to fetch events'));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, isAdmin]);

  useEffect(() => {
    if (currentUser !== undefined && isAdmin !== undefined) {
      fetchAllEvents();
    }
  }, [fetchAllEvents, currentUser, isAdmin]);

  // Placeholder for admin actions on events
  // const adminUpdateEventStatus = async (eventId: string, newStatus: Event['status']) => { ... };

  const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    if (!slug || !isValidSlug(slug)) return false;
    
    const eventsRef = collection(firestore, EVENTS_COLLECTION);
    const websiteQuery = query(
      eventsRef,
      where('website.customUrlSlug', '==', slug)
    );
    const snapshot = await getDocs(websiteQuery);
    return snapshot.empty;
  };

  const addEvent = async (
    eventData: CreateEventPayload,
    websiteData?: UpdateEventWebsiteDetailsPayload
  ): Promise<Event | null> => {
    if (!currentUser) {
      setError(new Error("User not authenticated. Cannot add event."));
      return null;
    }
    setIsLoading(true); // Or a specific isAddingEvent state
    setError(null);
    try {
      // Create object with only defined values, omitting undefined/null values
      const baseData = {
        name: eventData.name,
        name_lowercase: eventData.name.toLowerCase(),
        organizerId: currentUser.uid,
        date: eventData.date,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: getEventStatus(eventData.date, eventData.endDate),
        visibility: eventData.visibility,
      };

      // Only add optional fields if they have non-null, non-undefined values
      const dataToSave = {
        ...baseData,
        ...(eventData.description && { description: eventData.description }),
        ...(eventData.time && { time: eventData.time }),
        ...(eventData.location && { location: eventData.location }),
        ...(eventData.themeId && { themeId: eventData.themeId }), // Only add if themeId exists and is not null
      };
      const eventDocRef = await addDoc(collection(firestore, EVENTS_COLLECTION), dataToSave);
      
      // Validate URL slug if provided
      if (websiteData?.customUrlSlug) {
        const isSlugValid = await checkSlugAvailability(websiteData.customUrlSlug);
        if (!isSlugValid) {
          setError(new Error('URL slug is invalid or already in use'));
          return null;
        }
      }

      // If websiteData is provided, save it to both places
      if (websiteData && Object.keys(websiteData).length > 0) {
        try {
          // Save website details to subcollection
          const websiteDetailsRef = doc(firestore, EVENTS_COLLECTION, eventDocRef.id, WEBSITE_SUBCOLLECTION, WEBSITE_DOC_ID);
          await setDoc(websiteDetailsRef, { ...websiteData, eventId: eventDocRef.id, lastUpdatedAt: serverTimestamp() });

          // Save website field to main event document
          const websiteFieldData = {
            customUrlSlug: websiteData.customUrlSlug,
            published: websiteData.published,
          };
          await updateDoc(eventDocRef, { 
            website: websiteFieldData,
            updatedAt: serverTimestamp()
          });
        } catch (webError) {
          console.error("Failed to save event website details during event creation:", webError);
          return null; // Return null to indicate creation failure
        }
      }
      
      // Construct the event object to return, simulating serverTimestamp resolution
      const newEvent: Event = {
        id: eventDocRef.id,
        ...eventData,
        name_lowercase: dataToSave.name_lowercase,
        organizerId: dataToSave.organizerId,
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        status: dataToSave.status,
      };
      
      fetchAllEvents(); 
      return newEvent;
    } catch (e) {
      console.error("Failed to add event:", e);
      setError(e instanceof Error ? e : new Error('Failed to add event'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (
    eventId: string,
    eventData: UpdateEventPayload,
    websiteData?: UpdateEventWebsiteDetailsPayload
  ): Promise<boolean> => {
    if (!currentUser) {
      setError(new Error("User not authenticated. Cannot update event."));
      return false;
    }
    setIsLoading(true); // Or a specific isUpdatingEvent state
    setError(null);
    try {
      const eventDocRef = doc(firestore, EVENTS_COLLECTION, eventId);
      const eventSnap = await getDoc(eventDocRef);

      if (!eventSnap.exists()) {
        setError(new Error("Event not found."));
        return false;
      }

      const existingEventData = eventSnap.data() as Event;

      // Permission check: User must be the organizer or an admin
      if (existingEventData.organizerId !== currentUser.uid && !isAdmin) {
        setError(new Error("Permission denied. You can only update your own events."));
        return false;
      }
      
      type EventUpdateFirestorePayload = Omit<Partial<Event>, 'updatedAt'> & {
        updatedAt: FieldValue;
        name_lowercase?: string;
      };

      const dataToUpdate: EventUpdateFirestorePayload = {
        ...(eventData as Omit<Partial<Event>, 'updatedAt'>),
        updatedAt: serverTimestamp(),
      };

      if (eventData.name) {
        dataToUpdate.name_lowercase = eventData.name.toLowerCase();
      }
      // If date or endDate changes, status might need recalculation
      if (eventData.date || eventData.endDate) {
        // Fetch current event data to get other date part if only one is changing
        const currentEvent = allEvents.find(e => e.id === eventId);
        const newDate = eventData.date || currentEvent?.date;
        const newEndDate = eventData.endDate || currentEvent?.endDate;
        if (newDate) { // Ensure date is available for status calculation
            dataToUpdate.status = getEventStatus(newDate, newEndDate);
        }
      }


      await updateDoc(eventDocRef, dataToUpdate);

      // If websiteData is provided, update it in both places
      if (websiteData && Object.keys(websiteData).length > 0) {
        try {
          // Update website details in subcollection
          const websiteDetailsRef = doc(firestore, EVENTS_COLLECTION, eventId, WEBSITE_SUBCOLLECTION, WEBSITE_DOC_ID);
          await setDoc(websiteDetailsRef, { ...websiteData, lastUpdatedAt: serverTimestamp() }, { merge: true });

          // Update website field in main event document
          const websiteFieldData = {
            customUrlSlug: websiteData.customUrlSlug,
            published: websiteData.published,
          };
          await updateDoc(eventDocRef, { 
            website: websiteFieldData,
            updatedAt: serverTimestamp()
          });
        } catch (webError) {
          console.error(`Failed to update event website details for event ${eventId}:`, webError);
          return false; // Return false to indicate update failure
        }
      }
      
      fetchAllEvents(); 
      return true;
    } catch (e) {
      console.error(`Failed to update event ${eventId}:`, e);
      setError(e instanceof Error ? e : new Error('Failed to update event'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getEventWebsiteDetails = async (eventId: string): Promise<WebsitePayload | null> => {
    if (!currentUser || !isAdmin) {
      // Depending on your rules, non-admins/organizers might still read public website details.
      // For admin panel context, let's assume admin/organizer rights are preferred.
      // This check might need adjustment based on broader app permissions.
      console.warn("Attempted to fetch website details without sufficient permissions or auth state.");
      // return null; // Or throw error
    }
    if (!eventId) {
      console.error("Event ID is required to fetch website details.");
      return null;
    }
    try {
      const websiteDetailsRef = doc(firestore, EVENTS_COLLECTION, eventId, WEBSITE_SUBCOLLECTION, WEBSITE_DOC_ID);
      const docSnap = await getDoc(websiteDetailsRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert from EventWebsiteDetails to WebsitePayload by omitting eventId and lastUpdatedAt
        const websiteData: WebsitePayload = {
          title: data.title,
          customUrlSlug: data.customUrlSlug,
          headerImageUrl: data.headerImageUrl,
          welcomeMessage: data.welcomeMessage,
          sections: data.sections || [],
          websiteThemeId: data.websiteThemeId,
          published: data.published || false
        };
        return websiteData;
      }
      return null; // No website details found
    } catch (e) {
      console.error(`Failed to fetch website details for event ${eventId}:`, e);
      setError(e instanceof Error ? e : new Error('Failed to fetch website details'));
      return null;
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!currentUser || !isAdmin) {
      setError(new Error("Permission denied. Only admins can delete events."));
      return false;
    }
    
    setError(null);
    try {
      const eventDocRef = doc(firestore, EVENTS_COLLECTION, eventId);
      
      // Delete the main event document
      await deleteDoc(eventDocRef);
      
      // Also delete the website subcollection if it exists
      try {
        const websiteDetailsRef = doc(firestore, EVENTS_COLLECTION, eventId, WEBSITE_SUBCOLLECTION, WEBSITE_DOC_ID);
        await deleteDoc(websiteDetailsRef);
      } catch (webError) {
        // Website details might not exist, which is fine
        console.warn(`Website details not found for event ${eventId}:`, webError);
      }
      
      // Optimistically update local state
      setAllEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
      
      // Update grouped events
      setGroupedEvents(prevGroups => {
        const newGroups = { ...prevGroups };
        Object.keys(newGroups).forEach(key => {
          newGroups[key as keyof GroupedEvents] = newGroups[key as keyof GroupedEvents].filter(e => e.id !== eventId);
        });
        return newGroups;
      });
      
      return true;
    } catch (e) {
      console.error(`Failed to delete event ${eventId}:`, e);
      setError(e instanceof Error ? e : new Error('Failed to delete event'));
      return false;
    }
  };

  const bulkDeleteEvents = async (eventIds: string[]): Promise<{ success: number; failed: number; errors: string[] }> => {
    if (!currentUser || !isAdmin) {
      setError(new Error("Permission denied. Only admins can delete events."));
      return { success: 0, failed: eventIds.length, errors: ["Permission denied"] };
    }
    
    setError(null);
    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    
    // Process deletions in parallel for better performance
    const deletePromises = eventIds.map(async (eventId) => {
      try {
        const eventDocRef = doc(firestore, EVENTS_COLLECTION, eventId);
        
        // Delete the main event document
        await deleteDoc(eventDocRef);
        
        // Also delete the website subcollection if it exists
        try {
          const websiteDetailsRef = doc(firestore, EVENTS_COLLECTION, eventId, WEBSITE_SUBCOLLECTION, WEBSITE_DOC_ID);
          await deleteDoc(websiteDetailsRef);
        } catch (webError) {
          // Website details might not exist, which is fine
          console.warn(`Website details not found for event ${eventId}:`, webError);
        }
        
        return { success: true, eventId };
      } catch (e) {
        console.error(`Failed to delete event ${eventId}:`, e);
        return { success: false, eventId, error: e instanceof Error ? e.message : 'Unknown error' };
      }
    });
    
    const results = await Promise.all(deletePromises);
    
    results.forEach(result => {
      if (result.success) {
        success++;
      } else {
        failed++;
        errors.push(`Event ${result.eventId}: ${result.error}`);
      }
    });
    
    // Update local state only for successful deletions
    const successfulEventIds = results.filter(r => r.success).map(r => r.eventId);
    if (successfulEventIds.length > 0) {
      setAllEvents(prevEvents => prevEvents.filter(e => !successfulEventIds.includes(e.id)));
      
      // Update grouped events
      setGroupedEvents(prevGroups => {
        const newGroups = { ...prevGroups };
        Object.keys(newGroups).forEach(key => {
          newGroups[key as keyof GroupedEvents] = newGroups[key as keyof GroupedEvents].filter(e => !successfulEventIds.includes(e.id));
        });
        return newGroups;
      });
    }
    
    if (failed > 0) {
      setError(new Error(`Failed to delete ${failed} out of ${eventIds.length} events`));
    }
    
    return { success, failed, errors };
  };

  return { allEvents, groupedEvents, isLoading, error, fetchAllEvents, addEvent, updateEvent, getEventWebsiteDetails, deleteEvent, bulkDeleteEvents };
};
