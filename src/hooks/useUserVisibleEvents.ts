import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/types/eventTypes'; // Assuming web client has similar type
import { useAuth } from '@/context/AuthContext';
import { firestore } from '@/services/firebaseConfig';
import { collection, getDocs, query, where, Timestamp, QueryConstraint } from 'firebase/firestore';
import { getEventStatus } from '@/pages/admin/adminEventColumns'; // For status calculation

const EVENTS_COLLECTION = 'events';

export interface GroupedUserEvents {
  upcoming: Event[];
  ongoing: Event[];
  completed: Event[];
  // Potentially other categories like 'invitedTo' if applicable
  other: Event[];
}

export const useUserVisibleEvents = () => {
  const { currentUser } = useAuth();
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<GroupedUserEvents>({
    upcoming: [],
    ongoing: [],
    completed: [],
    other: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserVisibleEvents = useCallback(async () => {
    if (!currentUser) {
      setUserEvents([]);
      setGroupedEvents({ upcoming: [], ongoing: [], completed: [], other: [] });
      setIsLoading(false);
      // setError(new Error("User not authenticated.")); // Optional: set error or just clear
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const eventsCollectionRef = collection(firestore, EVENTS_COLLECTION);
      const queries: QueryConstraint[][] = [
        [where("visibility", "==", "public")],
        [where("organizerId", "==", currentUser.uid)],
        [where("allowedUserIds", "array-contains", currentUser.uid)],
        // Note: Querying for events where the user is part of a team (teamIds)
        // would require fetching user's teams first, then another query per team,
        // or a more complex data structure/denormalization in Firestore.
        // For simplicity, this example omits team-based event visibility for now.
      ];

      const eventPromises = queries.map(qConstraints => getDocs(query(eventsCollectionRef, ...qConstraints)));
      const querySnapshots = await Promise.all(eventPromises);
      
      const fetchedEventsMap = new Map<string, Event>();

      querySnapshots.forEach(snapshot => {
        snapshot.docs.forEach(docSnap => {
          if (!fetchedEventsMap.has(docSnap.id)) {
            const data = docSnap.data();
            const event = {
              id: docSnap.id,
              ...data,
              date: data.date && typeof data.date.toDate === 'function' ? (data.date as Timestamp).toDate().toISOString() : data.date as string,
              endDate: data.endDate && typeof data.endDate.toDate === 'function' ? (data.endDate as Timestamp).toDate().toISOString() : data.endDate as string | undefined,
              createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? (data.createdAt as Timestamp).toDate().toISOString() : (data.createdAt as string || new Date().toISOString()),
              updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? (data.updatedAt as Timestamp).toDate().toISOString() : (data.updatedAt as string || new Date().toISOString()),
              status: data.status || getEventStatus(
                data.date && typeof data.date.toDate === 'function' ? (data.date as Timestamp).toDate().toISOString() : data.date as string,
                data.endDate && typeof data.endDate.toDate === 'function' ? (data.endDate as Timestamp).toDate().toISOString() : data.endDate as string | undefined
              ),
            } as Event;
            fetchedEventsMap.set(docSnap.id, event);
          }
        });
      });

      const uniqueEvents = Array.from(fetchedEventsMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setUserEvents(uniqueEvents);

      // Group events
      const groups: GroupedUserEvents = { upcoming: [], ongoing: [], completed: [], other: [] };
      uniqueEvents.forEach(event => {
        const status = event.status || 'other'; // Default to 'other'
        if (groups[status as keyof GroupedUserEvents]) {
          groups[status as keyof GroupedUserEvents].push(event);
        } else {
          groups.other.push(event);
        }
      });
      setGroupedEvents(groups);

    } catch (e) {
      console.error("Failed to fetch user visible events:", e);
      setError(e instanceof Error ? e : new Error('Failed to fetch events'));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    // currentUser could be null initially, then populated.
    // We want to fetch when currentUser is definitively known (or known to be null).
    if (currentUser !== undefined) { 
        fetchUserVisibleEvents();
    }
  }, [fetchUserVisibleEvents, currentUser]);

  return { userEvents, groupedEvents, isLoading, error, refetchEvents: fetchUserVisibleEvents };
};
