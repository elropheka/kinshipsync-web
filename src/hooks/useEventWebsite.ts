import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';
import type { Event, WebsitePayload, UpdateEventWebsiteDetailsPayload } from '../types/eventTypes';

type LookupType = 'id' | 'slug';

export const useEventWebsite = (identifier: string | undefined, lookupType: LookupType = 'slug') => {
  const [event, setEvent] = useState<Event | null>(null);
  const [websiteDetails, setWebsiteDetails] = useState<WebsitePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventAndWebsite = async () => {
      if (!identifier) return;

      setLoading(true);
      setError(null);
      try {
        let eventDoc;

        if (lookupType === 'id') {
          // Direct lookup by event ID
          const eventDocRef = doc(firestore, 'events', identifier);
          const eventDocSnap = await getDoc(eventDocRef);
          if (eventDocSnap.exists()) {
            eventDoc = eventDocSnap;
          }
        } else {
          // Find event by slug using case-insensitive comparison
          const eventsRef = collection(firestore, 'events');
          const eventsSnapshot = await getDocs(eventsRef);
          
          eventDoc = eventsSnapshot.docs.find((docSnapshot: QueryDocumentSnapshot) => {
            const data = docSnapshot.data();
            const docSlug = data.website?.customUrlSlug?.toLowerCase();
            const searchSlug = identifier?.toLowerCase();
            return docSlug === searchSlug;
          });
        }

        if (!eventDoc) {
          setError('Event not found');
          return;
        }

        const eventData = eventDoc.data();
        setEvent({
          id: eventDoc.id,
          ...eventData,
          createdAt: eventData.createdAt instanceof Timestamp ? eventData.createdAt.toDate().toISOString() : new Date().toISOString(),
          updatedAt: eventData.updatedAt instanceof Timestamp ? eventData.updatedAt.toDate().toISOString() : new Date().toISOString(),
        } as Event);

        // Then fetch website details
        const websiteDocRef = doc(collection(firestore, 'events', eventDoc.id, 'website'), 'details');
        const websiteDoc = await getDoc(websiteDocRef);

        if (websiteDoc.exists()) {
          const data = websiteDoc.data();
          setWebsiteDetails({
            title: data.title,
            customUrlSlug: data.customUrlSlug,
            headerImageUrl: data.headerImageUrl,
            welcomeMessage: data.welcomeMessage,
            sections: data.sections || [],
            websiteThemeId: data.websiteThemeId,
            published: data.published || false
          });
        } else {
          // Initialize with default values if no website exists
          setWebsiteDetails({
            published: false,
            sections: []
          });
        }
      } catch (err) {
        console.error('Error fetching event and website details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndWebsite();
  }, [identifier, lookupType]);

  const updateWebsiteDetails = async (updates: UpdateEventWebsiteDetailsPayload): Promise<void> => {
    if (!event?.id) return;

    try {
      // First update the website details subcollection
      const websiteDocRef = doc(collection(firestore, 'events', event.id, 'website'), 'details');
      const updatedData = {
        ...updates,
        lastUpdatedAt: new Date().toISOString()
      };
      await setDoc(websiteDocRef, updatedData, { merge: true });

      // Then update the website field in the main event document
      const eventDocRef = doc(firestore, 'events', event.id);
      const eventWebsiteData = {
        customUrlSlug: updates.customUrlSlug,
        published: updates.published,
      };
      await updateDoc(eventDocRef, { 
        website: eventWebsiteData,
        updatedAt: Timestamp.now() // Update the event's updatedAt timestamp
      });

      // Update local state
      setWebsiteDetails(prev => prev ? {
        ...prev,
        ...updates
      } : null);

      // Update event local state to reflect the changes
      setEvent(prev => prev ? {
        ...prev,
        website: eventWebsiteData,
        updatedAt: new Date().toISOString()
      } : null);

      return;
    } catch (err) {
      console.error('Error updating website details:', err);
      throw new Error('Failed to update website details');
    }
  };

  return {
    event,
    websiteDetails,
    loading,
    error,
    updateWebsiteDetails
  };
};
