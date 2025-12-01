import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, getDocs, type QueryDocumentSnapshot, type DocumentData, Timestamp } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';
import type { InAppNotification } from '../types/notificationTypes';
import { useUserProfile } from './useUserProfile'; // Assuming this hook provides the current user's profile

interface UseNotificationsResult {
  notifications: InAppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  // Optionally, add a refresh function if needed, though onSnapshot handles real-time
}

const IN_APP_NOTIFICATIONS_COLLECTION = 'inAppNotifications';

export const useNotifications = (): UseNotificationsResult => {
  const { userProfile, isLoading: userLoading, error: userError } = useUserProfile();
  const userId = userProfile?.userId;

  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for notifications
  useEffect(() => {
    if (!userId) {
      if (!userLoading) {
        setLoading(false);
        setError(userError?.message || "User not authenticated.");
      }
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(firestore, IN_APP_NOTIFICATIONS_COLLECTION),
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedNotifications: InAppNotification[] = [];
      let currentUnreadCount = 0;

      querySnapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnapshot.data();
        const notification: InAppNotification = {
          id: docSnapshot.id,
          ...data,
          createdAt: getTimestampInMs(data.createdAt) || Date.now(),
          updatedAt: getTimestampInMs(data.updatedAt),
        } as InAppNotification; // Cast to ensure correct type, especially for timestamps

        fetchedNotifications.push(notification);
        if (!notification.isRead) {
          currentUnreadCount++;
        }
      });

      setNotifications(fetchedNotifications);
      setUnreadCount(currentUnreadCount);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching real-time notifications:", err);
      setError("Failed to load notifications.");
      setLoading(false);
    });

    // Cleanup listener on component unmount or userId change
    return () => unsubscribe();
  }, [userId, userLoading, userError]);

  // Function to mark a single notification as read
  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    if (!notificationId) return false;
    try {
      const notificationRef = doc(firestore, IN_APP_NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: Date.now(), // Use client timestamp for immediate UI update, serverTimestamp for consistency
      });
      // UI will update automatically via onSnapshot listener
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, []);

  // Function to mark all unread notifications as read
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;
    try {
      const unreadQuery = query(
        collection(firestore, IN_APP_NOTIFICATIONS_COLLECTION),
        where('recipientId', '==', userId),
        where('isRead', '==', false)
      );
      const querySnapshot = await getDocs(unreadQuery); // Use getDocs for a one-time fetch for batch

      if (querySnapshot.empty) {
        console.log('No unread notifications to mark as read.');
        return true;
      }

      const batch = writeBatch(firestore);
      querySnapshot.docs.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
        batch.update(docSnapshot.ref, { isRead: true, updatedAt: Date.now() });
      });
      await batch.commit();
      // UI will update automatically via onSnapshot listener
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, [userId]);

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead };
};

// Helper function to safely convert Firestore Timestamp to milliseconds
const getTimestampInMs = (timestamp: Timestamp | number): number | undefined => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toMillis();
  }
  // If it's already a number, or null/undefined, return it directly
  return typeof timestamp === 'number' ? timestamp : undefined;
};
