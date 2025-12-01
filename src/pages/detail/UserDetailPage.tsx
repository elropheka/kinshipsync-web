import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { doc, getDoc, Timestamp } from 'firebase/firestore'; // Added Timestamp
import { firestore } from '../../services/firebaseConfig'; // Adjust path as necessary
import type { UserProfile } from '../../types/userTypes'; // Use type-only import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // For avatar display

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is missing.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const rawData = userDocSnap.data();
          // Type assertion for rawData, assuming createdAt/updatedAt might be Timestamps
          const userData = rawData as Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'> & { 
            createdAt?: Timestamp | string; 
            updatedAt?: Timestamp | string;
          };
          
          setUser({
            userId: userDocSnap.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            displayName: userData.displayName,
            email: userData.email,
            bio: userData.bio,
            avatarUrl: userData.avatarUrl,
            dateOfBirth: userData.dateOfBirth,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            role: userData.role || 'organizer',
            isAdmin: userData.isAdmin,
            isVendor: userData.isVendor,
            createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate().toISOString() : String(userData.createdAt || ''),
            updatedAt: userData.updatedAt instanceof Timestamp ? userData.updatedAt.toDate().toISOString() : String(userData.updatedAt || ''),
          });
        } else {
          setError('User not found.');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div className="p-6 text-center">Loading user details...</div>;
  }

  if (error) {
    toast.error(getErrorMessage(error));
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Unable to load user details. Please try again.</p>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center">No user data found.</div>;
  }
  
  const getAvatarFallback = (name?: string | null) => {
    if (name) {
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('');
      return initials.toUpperCase() || 'U';
    }
    return 'U';
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <h1 className="text-2xl font-semibold mb-6">User Profile</h1>
      <div className="bg-background shadow-xl rounded-lg p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 text-4xl md:text-5xl mb-4 md:mb-0 md:mr-8">
            <AvatarImage src={user.avatarUrl} alt={user.displayName} />
            <AvatarFallback>{getAvatarFallback(user.displayName)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
                      <h2 className="text-3xl font-bold text-foreground">{user.displayName}</h2>
          <p className="text-md text-muted-foreground">{user.email}</p>
          <p className="text-sm text-primary mt-1">
              Role: {user.role}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {user.firstName && (
              <div className="sm:col-span-1">
                                  <dt className="text-sm font-medium text-muted-foreground">First Name</dt>
                  <dd className="mt-1 text-sm text-foreground">{user.firstName}</dd>
              </div>
            )}
            {user.lastName && (
              <div className="sm:col-span-1">
                                  <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
                  <dd className="mt-1 text-sm text-foreground">{user.lastName}</dd>
              </div>
            )}
            {user.phoneNumber && (
              <div className="sm:col-span-1">
                                  <dt className="text-sm font-medium text-muted-foreground">Phone Number</dt>
                  <dd className="mt-1 text-sm text-foreground">{user.phoneNumber}</dd>
              </div>
            )}
            {user.dateOfBirth && (
              <div className="sm:col-span-1">
                                  <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-foreground">{new Date(user.dateOfBirth).toLocaleDateString()}</dd>
              </div>
            )}
            {user.bio && (
              <div className="sm:col-span-2">
                                  <dt className="text-sm font-medium text-muted-foreground">Bio</dt>
                  <dd className="mt-1 text-sm text-foreground whitespace-pre-wrap">{user.bio}</dd>
              </div>
            )}
            {user.address && (
              <div className="sm:col-span-2">
                                  <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                  <dd className="mt-1 text-sm text-foreground">
                  {user.address.street && <div>{user.address.street}</div>}
                  {user.address.city && <span>{user.address.city}, </span>}
                  {user.address.state && <span>{user.address.state} </span>}
                  {user.address.postalCode && <span>{user.address.postalCode}</span>}
                  {user.address.country && <div>{user.address.country}</div>}
                </dd>
              </div>
            )}
             <div className="sm:col-span-1">
                                  <dt className="text-sm font-medium text-muted-foreground">Member Since</dt>
                  <dd className="mt-1 text-sm text-foreground">{new Date(user.createdAt).toLocaleDateString()}</dd>
              </div>
                              <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="mt-1 text-sm text-foreground">{new Date(user.updatedAt).toLocaleDateString()}</dd>
                </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
