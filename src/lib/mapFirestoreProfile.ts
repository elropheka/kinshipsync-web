import type { DocumentSnapshot } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import type { UserProfile } from '@/types/userTypes';

export function mapFirestoreProfileDoc(docSnap: DocumentSnapshot): UserProfile {
  const data = docSnap.data() ?? {};

  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : String(data.createdAt ?? new Date().toISOString());

  const updatedAt =
    data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : String(data.updatedAt ?? new Date().toISOString());

  const role = (data.role as UserProfile['role']) || 'organizer';

  return {
    ...data,
    userId: data.userId || docSnap.id,
    firstName: data.firstName || data.first_name || data.firstname,
    lastName: data.lastName || data.last_name || data.lastname,
    displayName: data.displayName || data.display_name || data.displayname || '',
    email: data.email ?? '',
    avatarUrl: data.avatar_url || data.avatarUrl,
    phoneNumber: data.phone_number || data.phoneNumber,
    dateOfBirth: data.date_of_birth || data.dateOfBirth,
    bio: data.bio,
    address: data.address,
    role,
    isAdmin: data.isAdmin ?? role === 'admin',
    isVendor: data.isVendor ?? role === 'vendor',
    createdAt,
    updatedAt,
  } as UserProfile;
}
