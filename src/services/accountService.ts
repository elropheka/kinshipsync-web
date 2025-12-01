import { firestore, auth } from '@/services/firebaseConfig';
import { 
  doc, 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { deleteFileFromStorage } from '@/services/storageService';

/**
 * Deletes a user account and all associated data
 * @param userId - The user ID to delete
 * @returns Promise<boolean> - Success status
 */
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Starting account deletion for user: ${userId}`);
    
    // Get current user for authentication
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
      throw new Error('User not authenticated or user ID mismatch');
    }

    // Start batch operations for data cleanup
    const batch = writeBatch(firestore);
    let batchCount = 0;
    const BATCH_LIMIT = 500; // Firestore batch limit

    // 1. Delete user profile
    console.log('Deleting user profile...');
    const profileRef = doc(firestore, 'profiles', userId);
    batch.delete(profileRef);
    batchCount++;

    // 2. Delete user's events
    console.log('Deleting user events...');
    const eventsQuery = query(
      collection(firestore, 'events'),
      where('organizerId', '==', userId)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    
    eventsSnapshot.forEach((doc) => {
      if (batchCount >= BATCH_LIMIT) {
        throw new Error('Too many documents to delete in single batch');
      }
      batch.delete(doc.ref);
      batchCount++;
    });

    // 3. Delete event invitations where user is invited
    console.log('Deleting event invitations...');
    const invitationsQuery = query(
      collection(firestore, 'invitations'),
      where('userId', '==', userId)
    );
    const invitationsSnapshot = await getDocs(invitationsQuery);
    
    invitationsSnapshot.forEach((doc) => {
      if (batchCount >= BATCH_LIMIT) {
        throw new Error('Too many documents to delete in single batch');
      }
      batch.delete(doc.ref);
      batchCount++;
    });

    // 4. Delete chat messages from user
    console.log('Deleting chat messages...');
    const messagesQuery = query(
      collection(firestore, 'messages'),
      where('senderId', '==', userId)
    );
    const messagesSnapshot = await getDocs(messagesQuery);
    
    messagesSnapshot.forEach((doc) => {
      if (batchCount >= BATCH_LIMIT) {
        throw new Error('Too many documents to delete in single batch');
      }
      batch.delete(doc.ref);
      batchCount++;
    });

    // 5. Delete notifications for user
    console.log('Deleting notifications...');
    const notificationsQuery = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId)
    );
    const notificationsSnapshot = await getDocs(notificationsQuery);
    
    notificationsSnapshot.forEach((doc) => {
      if (batchCount >= BATCH_LIMIT) {
        throw new Error('Too many documents to delete in single batch');
      }
      batch.delete(doc.ref);
      batchCount++;
    });

    // 6. Remove user from event guest lists (update events to remove user from guests)
    console.log('Removing user from event guest lists...');
    const allEventsQuery = query(collection(firestore, 'events'));
    const allEventsSnapshot = await getDocs(allEventsQuery);
    
    allEventsSnapshot.forEach((eventDoc) => {
      const eventData = eventDoc.data();
      if (eventData.guests && eventData.guests.includes(userId)) {
        if (batchCount >= BATCH_LIMIT) {
          throw new Error('Too many documents to delete in single batch');
        }
        batch.update(eventDoc.ref, {
          guests: eventData.guests.filter((guestId: string) => guestId !== userId)
        });
        batchCount++;
      }
    });

    // Commit the batch deletion
    if (batchCount > 0) {
      console.log(`Committing batch deletion of ${batchCount} documents...`);
      await batch.commit();
    }

    // 7. Delete user's uploaded files (avatar, etc.)
    console.log('Deleting user files...');
    try {
      // Delete avatar if exists
      const profileDoc = await getDocs(query(collection(firestore, 'profiles'), where('userId', '==', userId)));
      if (!profileDoc.empty) {
        const profileData = profileDoc.docs[0].data();
        if (profileData.avatarUrl) {
          await deleteFileFromStorage(profileData.avatarUrl);
        }
      }
    } catch (fileError) {
      console.warn('Error deleting user files:', fileError);
      // Don't fail the entire operation for file deletion errors
    }

    // 8. Delete Firebase Auth user (this should be last)
    console.log('Deleting Firebase Auth user...');
    await deleteUser(currentUser);

    console.log(`Successfully deleted account for user: ${userId}`);
    return true;

  } catch (error) {
    console.error(`Failed to delete account for user ${userId}:`, error);
    
    // If it's a Firebase Auth error, provide more specific messaging
    if (error instanceof Error) {
      if (error.message.includes('requires-recent-login')) {
        throw new Error('Please log in again before deleting your account for security reasons.');
      }
      if (error.message.includes('too-many-requests')) {
        throw new Error('Too many requests. Please try again later.');
      }
    }
    
    throw error;
  }
};

/**
 * Checks if a user can delete their account
 * @param userId - The user ID to check
 * @returns Promise<boolean> - Whether the user can delete their account
 */
export const canDeleteAccount = async (userId: string): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
      return false;
    }

    // Check if user has any ongoing events they're organizing
    const ongoingEventsQuery = query(
      collection(firestore, 'events'),
      where('organizerId', '==', userId),
      where('status', '==', 'ongoing')
    );
    const ongoingEventsSnapshot = await getDocs(ongoingEventsQuery);
    
    if (!ongoingEventsSnapshot.empty) {
      return false; // Cannot delete if organizing ongoing events
    }

    return true;
  } catch (error) {
    console.error('Error checking if user can delete account:', error);
    return false;
  }
};
