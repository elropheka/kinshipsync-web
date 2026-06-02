import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  getDocs,
  type QueryDocumentSnapshot,
  type DocumentData,
  Timestamp,
  type FirestoreError,
} from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';
import type { InAppNotification } from '../types/notificationTypes';
import { useAuth } from '@/context/AuthContext';

interface UseNotificationsResult {
  notifications: InAppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
}

const IN_APP_NOTIFICATIONS_COLLECTION = 'inAppNotifications';

const getTimestampInMs = (timestamp: Timestamp | number | undefined): number | undefined => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toMillis();
  }
  return typeof timestamp === 'number' ? timestamp : undefined;
};

const mapSnapshotToNotifications = (
  querySnapshot: { forEach: (fn: (doc: QueryDocumentSnapshot<DocumentData>) => void) => void }
): { notifications: InAppNotification[]; unreadCount: number } => {
  const fetchedNotifications: InAppNotification[] = [];
  let currentUnreadCount = 0;

  querySnapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
    const data = docSnapshot.data();
    if (data.isDeleted === true) {
      return;
    }

    const notification: InAppNotification = {
      id: docSnapshot.id,
      ...data,
      createdAt: getTimestampInMs(data.createdAt) ?? Date.now(),
      updatedAt: getTimestampInMs(data.updatedAt),
    } as InAppNotification;

    fetchedNotifications.push(notification);
    if (!notification.isRead) {
      currentUnreadCount++;
    }
  });

  fetchedNotifications.sort((a, b) => b.createdAt - a.createdAt);

  return { notifications: fetchedNotifications, unreadCount: currentUnreadCount };
};

const isIndexError = (err: FirestoreError): boolean =>
  err.code === 'failed-precondition' ||
  (typeof err.message === 'string' && err.message.includes('index'));

export const useNotifications = (): UseNotificationsResult => {
  const { currentUser, loading: authLoading } = useAuth();
  const userId = currentUser?.uid ?? null;

  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe: (() => void) | undefined;

    const handleSuccess = (querySnapshot: Parameters<typeof mapSnapshotToNotifications>[0]) => {
      const { notifications: next, unreadCount: count } =
        mapSnapshotToNotifications(querySnapshot);
      setNotifications(next);
      setUnreadCount(count);
      setLoading(false);
      setError(null);
    };

    const handleFailure = (err: FirestoreError, usedOrderBy: boolean) => {
      if (usedOrderBy && isIndexError(err)) {
        unsubscribe?.();
        unsubscribe = subscribe(false);
        return;
      }
      console.error('Error fetching real-time notifications:', err);
      setError('Unable to load notifications. Please try again.');
      setLoading(false);
    };

    const subscribe = (withOrderBy: boolean) =>
      onSnapshot(
        withOrderBy
          ? query(
              collection(firestore, IN_APP_NOTIFICATIONS_COLLECTION),
              where('recipientId', '==', userId),
              orderBy('createdAt', 'desc')
            )
          : query(
              collection(firestore, IN_APP_NOTIFICATIONS_COLLECTION),
              where('recipientId', '==', userId)
            ),
        (querySnapshot) => handleSuccess(querySnapshot),
        (err) => handleFailure(err as FirestoreError, withOrderBy)
      );

    unsubscribe = subscribe(true);

    return () => unsubscribe?.();
  }, [userId, authLoading]);

  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    if (!notificationId) return false;
    try {
      const notificationRef = doc(firestore, IN_APP_NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: Date.now(),
      });
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;
    try {
      const unreadQuery = query(
        collection(firestore, IN_APP_NOTIFICATIONS_COLLECTION),
        where('recipientId', '==', userId),
        where('isRead', '==', false)
      );
      const querySnapshot = await getDocs(unreadQuery);

      if (querySnapshot.empty) {
        return true;
      }

      const batch = writeBatch(firestore);
      querySnapshot.docs.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
        batch.update(docSnapshot.ref, { isRead: true, updatedAt: Date.now() });
      });
      await batch.commit();
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, [userId]);

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead };
};
