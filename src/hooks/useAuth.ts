import { useState, useEffect } from 'react';
import { onAuthStateChanged} from 'firebase/auth'; //removed unused imports firebaseAuthUser
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../services/firebaseConfig'; // Assuming firebaseConfig exports 'auth' and 'firestore'
import type { UserProfile } from '../types/userTypes'; // Import UserProfile type

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile from Firestore
        try {
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userProfile = userDocSnap.data() as UserProfile;
            setAuthState({
              user: { ...userProfile, userId: firebaseUser.uid }, // Ensure userId is set
              isAuthenticated: true,
              loading: false,
            });
          } else {
            // User profile not found in Firestore, but authenticated via Firebase Auth
            console.warn(`User profile not found for UID: ${firebaseUser.uid}`);
            setAuthState({
              user: {
                userId: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || firebaseUser.email || 'Anonymous',
                role: 'member', // Default role if profile not found
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              isAuthenticated: true,
              loading: false,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      } else {
        // User is signed out
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return authState;
};
