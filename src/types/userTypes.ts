// User Profile
export interface UserProfile {
  userId: string; // Corresponds to the auth user ID (Firebase UID)
  firstName?: string;
  firstName_lowercase?: string; // For case-insensitive search
  lastName?: string;
  lastName_lowercase?: string; // For case-insensitive search
  displayName: string; // This should be consistently available
  displayName_lowercase?: string; // For case-insensitive search
  email: string; // From auth, stored for easy access/display
  bio?: string;
  avatarUrl?: string;
  dateOfBirth?: string; // ISO 8601 string
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  fcmTokens?: string[]; // Firebase Cloud Messaging tokens, usually managed server-side or via specific hooks
  
  role: "organizer" | "admin" | "vendor" | "member"; // Singular role
  isAdmin?: boolean; // Explicit admin status (may become redundant)
  isVendor?: boolean; // Explicit vendor status (may become redundant)

  // Timestamps
  createdAt: string; // ISO 8601 string, from Firestore Timestamp
  updatedAt: string; // ISO 8601 string, from Firestore Timestamp
}

// For updating a user's profile.
// Some fields like userId, email, createdAt, updatedAt are typically not updatable directly by user or only by admin.
// Note: Omit 'roles' if it's fully replaced by 'role'. If 'roles' array is for secondary permissions, it might stay.
// For now, assuming 'role' is the primary and 'roles' array might be deprecated or for other uses.
export type UpdateUserProfilePayload = Partial<Omit<UserProfile, 'userId' | 'email' | 'createdAt' | 'updatedAt' | 'roles' /* if roles array is removed */>>;

// For admin creating/updating user profiles, might need a different payload
// that allows changing roles or email (though email change is complex with Firebase Auth).
export interface AdminUpdateUserProfilePayload extends Partial<Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>> {
  role?: "organizer" | "admin" | "vendor" | "member"; // Singular role for admin updates
  // roles?: UserProfile['roles']; // If roles array is still used for secondary permissions
  isAdmin?: boolean; // May become redundant
  isVendor?: boolean; // May become redundant
}
