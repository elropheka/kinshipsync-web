import { useState, useCallback, useEffect } from 'react';
import type { UserProfile, UpdateUserProfilePayload } from '@/types/userTypes'; // Added UpdateUserProfilePayload
import { useAuth } from '@/context/AuthContext'; // Import useAuth to get currentUser
import { firestore } from '@/services/firebaseConfig';
import { doc, getDoc, Timestamp, updateDoc, serverTimestamp, type FieldValue } from 'firebase/firestore'; // Added updateDoc, serverTimestamp, FieldValue

const PROFILES_COLLECTION = 'profiles'; // Changed to 'profiles' to be consistent

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
  isUpdating: boolean; // Added isUpdating state
  error: Error | null;
  fetchUserProfile: () => Promise<void>; // Expose fetch function
  updateCurrentUserProfile: (profileData: UpdateUserProfilePayload) => Promise<boolean>; // Added update function
}

export const useUserProfile = (userId?: string): UseUserProfileReturn => {
  const { currentUser } = useAuth(); // Get currentUser for updates
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Determine the effective user ID: passed prop or current authenticated user
  const effectiveUserId = userId || currentUser?.uid;

  // Fetch profile automatically when hook mounts or effectiveUserId changes
  useEffect(() => {
    if (effectiveUserId) {
      fetchUserProfile();
    }
  }, [effectiveUserId]);

  const fetchUserProfile = useCallback(async () => {
    if (!effectiveUserId) {
      setUserProfile(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    // Renamed inner function to avoid conflict with exported function name
    const doFetchUserProfile = async () => {
      try {
        const userDocRef = doc(firestore, PROFILES_COLLECTION, effectiveUserId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Raw Firestore data for profile:", { userId: effectiveUserId, data });
          // Normalize field names to handle both camelCase and snake_case
          const normalizedData = {
            ...data, // Keep all original data
            // Handle name fields with both formats, preserving original if exists
            firstName: data.firstName || data.first_name || data.firstname || undefined,
            lastName: data.lastName || data.last_name || data.lastname || undefined,
            displayName: data.displayName || data.display_name || data.displayname || undefined,
            // Ensure we have the correct ID
            userId: docSnap.id,
            // Convert Firestore Timestamps to ISO strings if necessary
            createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? (data.createdAt as Timestamp).toDate().toISOString() : data.createdAt as string,
            updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? (data.updatedAt as Timestamp).toDate().toISOString() : data.updatedAt as string,
            dateOfBirth: data.dateOfBirth && typeof data.dateOfBirth.toDate === 'function' ? (data.dateOfBirth as Timestamp).toDate().toISOString() : data.dateOfBirth as string | undefined,
          } as UserProfile;

          console.log("Normalized profile data:", {
            userId: effectiveUserId,
            firstName: normalizedData.firstName,
            lastName: normalizedData.lastName,
            displayName: normalizedData.displayName
          });

          const profile = normalizedData;
          setUserProfile(profile);
        } else {
          // If fetching for the current user and profile doesn't exist, it might be an error or pending creation.
          // If fetching for an arbitrary userId, then "not found" is appropriate.
          setError(new Error(`User profile not found for ID: ${effectiveUserId}.`));
          setUserProfile(null);
        }
      } catch (e) {
        console.error(`Failed to fetch user profile for ${effectiveUserId}:`, e);
        setError(e instanceof Error ? e : new Error('Failed to fetch user profile'));
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    doFetchUserProfile();
  }, [effectiveUserId]); // Depend on effectiveUserId

  const updateCurrentUserProfile = async (profileData: UpdateUserProfilePayload): Promise<boolean> => {
    if (!currentUser?.uid) {
      setError(new Error('User not authenticated. Cannot update profile.'));
      return false;
    }
    setIsUpdating(true);
    setError(null);
    try {
      const userDocRef = doc(firestore, PROFILES_COLLECTION, currentUser.uid);
      
      type UserProfileUpdateFirestorePayload = Omit<UpdateUserProfilePayload, 'updatedAt'> & {
        updatedAt: FieldValue;
        displayName_lowercase?: string;
        firstName_lowercase?: string;
        lastName_lowercase?: string;
      };

      const dataToUpdate: UserProfileUpdateFirestorePayload = {
        ...(profileData as Omit<UpdateUserProfilePayload, 'updatedAt'>),
        updatedAt: serverTimestamp(),
      };

      if (profileData.displayName) {
        dataToUpdate.displayName_lowercase = profileData.displayName.toLowerCase();
      }
      if (profileData.firstName) {
        dataToUpdate.firstName_lowercase = profileData.firstName.toLowerCase();
      }
      if (profileData.lastName) {
        dataToUpdate.lastName_lowercase = profileData.lastName.toLowerCase();
      }

      await updateDoc(userDocRef, dataToUpdate);
      
      // Optimistically update local state or refetch
      await fetchUserProfile(); // Refetch to update the local profile state
      return true;
    } catch (e) {
      console.error(`Failed to update user profile for ${currentUser.uid}:`, e);
      setError(e instanceof Error ? e : new Error('Failed to update profile'));
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { userProfile, isLoading, isUpdating, error, fetchUserProfile, updateCurrentUserProfile };
};
