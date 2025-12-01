import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, AdminUpdateUserProfilePayload } from '@/types/userTypes'; // Added AdminUpdateUserProfilePayload
import { useAuth } from '@/context/AuthContext'; // For admin permission checks
import { firestore } from '@/services/firebaseConfig';
import { 
  collection, getDocs, query, orderBy, Timestamp,
  doc, updateDoc, serverTimestamp, type FieldValue // FieldValue for serverTimestamp type
} from 'firebase/firestore';

const USERS_COLLECTION = 'profiles'; // Changed to 'profiles' to match AuthContext and Auth.tsx

export const useAllUsers = () => {
  const { currentUser, isAdmin } = useAuth(); // For checking admin role
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllUsers = useCallback(async () => {
    if (!currentUser || !isAdmin) {
      setError(new Error("Permission denied. Only admins can view all users."));
      setIsLoading(false);
      setUsers([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const usersCollectionRef = collection(firestore, USERS_COLLECTION);
      const q = query(usersCollectionRef, orderBy("createdAt", "desc")); // Example ordering
      const querySnapshot = await getDocs(q);
      
      const fetchedUsers = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        // Explicitly map snake_case fields from Firestore to camelCase fields in UserProfile
        return {
          ...data,
          userId: data.userId || docSnap.id,
          firstName: data.first_name || data.firstName, // Handle both cases if some docs are different, prioritize snake_case
          lastName: data.last_name || data.lastName,   // Handle both cases
          displayName: data.displayName, // Assuming displayName is correctly cased or consistently available
          email: data.email,
          // Ensure all other fields expected by UserProfile are mapped or spread if names match
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          // Map other fields from snake_case if necessary, e.g., avatar_url to avatarUrl
          avatarUrl: data.avatar_url || data.avatarUrl,
          phoneNumber: data.phone_number || data.phoneNumber,
          // Map role and role-based flags
          role: data.role || 'organizer',
          isAdmin: data.role === 'admin',
          isVendor: data.role === 'vendor',
          bio: data.bio,
          dateOfBirth: data.date_of_birth || data.dateOfBirth,
          address: data.address, // Assuming address sub-object fields are correctly cased or don't need mapping here
        } as UserProfile; // Cast to UserProfile, ensure all required fields are present
      });
      setUsers(fetchedUsers);
    } catch (e) {
      console.error("Failed to fetch all users:", e);
      setError(e instanceof Error ? e : new Error('Failed to fetch users'));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, isAdmin]);

  useEffect(() => {
    if (currentUser !== undefined && isAdmin !== undefined) {
      fetchAllUsers();
    }
  }, [fetchAllUsers, currentUser, isAdmin]);

  // Placeholder for admin actions on users (e.g., change role, delete user)
  // const adminUpdateUserRole = async (userId: string, newRole: UserProfile['role']) => { ... };
  // const adminDeleteUser = async (userId: string) => { ... };

  const adminUpdateUserProfile = async (
    userId: string, 
    profileData: AdminUpdateUserProfilePayload // Using the specific admin payload type
  ): Promise<boolean> => {
    if (!currentUser || !isAdmin) {
      setError(new Error("Permission denied. Only admins can update user profiles."));
      return false;
    }
    // setIsLoading(true); // Consider a specific loading state for updates
    setError(null);
    try {
      const userDocRef = doc(firestore, USERS_COLLECTION, userId);
      
      // Define a more specific type for the update payload
      type UserProfileUpdateFirestorePayload = Omit<AdminUpdateUserProfilePayload, 'updatedAt' | 'createdAt' | 'userId' | 'email'> & {
        updatedAt: FieldValue;
        displayName_lowercase?: string;
        firstName_lowercase?: string;
        lastName_lowercase?: string;
      };

      const dataToUpdate: UserProfileUpdateFirestorePayload = { 
        ...(profileData as Omit<AdminUpdateUserProfilePayload, 'updatedAt' | 'createdAt' | 'userId' | 'email'>), 
        updatedAt: serverTimestamp() 
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
      fetchAllUsers(); // Refetch to get updated list
      return true;
    } catch (e) {
      console.error(`Failed to update user profile ${userId}:`, e);
      setError(e instanceof Error ? e : new Error('Failed to update user profile'));
      return false;
    } finally {
      // setIsLoading(false);
    }
  };

  return { users, isLoading, error, fetchAllUsers, adminUpdateUserProfile /*, adminUpdateUserRole, adminDeleteUser */ };
};
