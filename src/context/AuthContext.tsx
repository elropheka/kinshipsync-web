import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth'; // Renamed to avoid conflict
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '@/services/firebaseConfig'; // Added firestore
import { doc, getDoc } from 'firebase/firestore'; // Added getDoc
import type { UserProfile } from '@/types/userTypes'; // For roles, isAdmin, isVendor

// AppUser extends FirebaseUser with role information
interface AppUser extends FirebaseUser {
  role?: 'admin' | 'vendor' | 'organizer' | 'member'; // Single role type matching UserProfile
}

// This interface represents the structure of the document in the 'profiles' Firestore collection
interface FirestoreProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  role?: 'admin' | 'vendor' | 'organizer'; // Single role string from Firestore
  isAdmin?: boolean; // Boolean from Firestore
  isVendor?: boolean; // Boolean from Firestore
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

interface AuthContextType {
  currentUser: AppUser | null;
  userProfile: UserProfile | null; // Store the transformed UserProfile (with roles array)
  loading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  // login, logout, signup functions can be added here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Ensure useAuth is exported
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, now fetch their profile from Firestore 'profiles' collection
        const profileDocRef = doc(firestore, "profiles", firebaseUser.uid); // Changed "users" to "profiles"
        try {
          const docSnap = await getDoc(profileDocRef);
          if (docSnap.exists()) {
            const firestoreProfile = docSnap.data() as FirestoreProfile;
            
            const webUserProfile: UserProfile = {
              ...firestoreProfile, // Spread all fields from Firestore profile
              role: firestoreProfile.role || 'organizer', // Default to 'organizer' if no role is set
              isAdmin: firestoreProfile.role === 'admin',
              isVendor: firestoreProfile.role === 'vendor',
            };
            
            setUserProfile(webUserProfile);
            setCurrentUser({ ...firebaseUser, role: webUserProfile.role });

          } else {
            console.warn(`No profile found in 'profiles' collection for user ${firebaseUser.uid}. User will have no specific roles or admin/vendor status.`);
            // Create a default UserProfile structure if no profile exists
            const defaultWebProfile: UserProfile = {
              userId: firebaseUser.uid,
              displayName: firebaseUser.displayName || "Anonymous User",
              email: firebaseUser.email || "",
              role: 'organizer', // Default role
              isAdmin: false,
              isVendor: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setUserProfile(defaultWebProfile);
            setCurrentUser({ ...firebaseUser, role: defaultWebProfile.role });
          }
        } catch (error) {
          console.error("Error fetching user profile from 'profiles' collection:", error);
          setUserProfile(null); 
          setCurrentUser({ ...firebaseUser, role: 'organizer' }); // Default on error
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Derive isAdmin and isVendor from the userProfile.role
  const isAdmin = userProfile?.role === 'admin';
  const isVendor = userProfile?.role === 'vendor';

  const value = {
    currentUser, // This is AppUser, includes role string
    userProfile, // This is UserProfile, includes isAdmin/isVendor booleans
    loading,
    isAdmin,   // Derived from userProfile.isAdmin
    isVendor,  // Derived from userProfile.isVendor
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
