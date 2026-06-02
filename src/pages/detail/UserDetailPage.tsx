import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { DetailPageSkeleton } from '@/components/common/skeletons';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/services/firebaseConfig';
import type { UserProfile } from '@/types/userTypes';
import { mapFirestoreProfileDoc } from '@/lib/mapFirestoreProfile';
import { ProfileDisplayNameResolver } from '@/lib/profileDisplayName';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

const PROFILES_COLLECTION = 'profiles';

const UserDetailPage: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
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
        const userDocRef = doc(firestore, PROFILES_COLLECTION, userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser(mapFirestoreProfileDoc(userDocSnap));
        } else {
          setError('User not found.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useErrorToast(error, { title: 'Unable to load user' });

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Unable to load user details"
        className="p-6"
      />
    );
  }

  if (!user) {
    return <div className="p-6 text-center text-muted-foreground">No user data found.</div>;
  }

  const displayName = ProfileDisplayNameResolver.fromProfile(user, user.email);

  const getAvatarFallback = (name: string) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('');
    return initials.toUpperCase() || 'U';
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10 bg-background">
      <Button variant="ghost" asChild className="mb-4 -ml-2 text-primary hover:bg-primary/10">
        <Link to="/dashboard/admin/users">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to users
        </Link>
      </Button>

      <div className="rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 md:h-28 md:w-28">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback className="text-2xl">{getAvatarFallback(displayName)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{displayName}</h1>
            <p className="text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              {user.email}
            </p>
            {user.phoneNumber && (
              <p className="text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                {user.phoneNumber}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
              {user.isAdmin && <Badge>Admin</Badge>}
              {user.isVendor && <Badge variant="outline">Vendor</Badge>}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">User ID</dt>
              <dd className="mt-1 text-sm text-foreground font-mono break-all">{user.userId}</dd>
            </div>
            {user.firstName && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">First name</dt>
                <dd className="mt-1 text-sm text-foreground">{user.firstName}</dd>
              </div>
            )}
            {user.lastName && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last name</dt>
                <dd className="mt-1 text-sm text-foreground">{user.lastName}</dd>
              </div>
            )}
            {user.displayName && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Display name</dt>
                <dd className="mt-1 text-sm text-foreground">{user.displayName}</dd>
              </div>
            )}
            {user.dateOfBirth && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date of birth</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </dd>
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
                  {(user.address.city || user.address.state || user.address.postalCode) && (
                    <div>
                      {[user.address.city, user.address.state, user.address.postalCode]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                  {user.address.country && <div>{user.address.country}</div>}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Member since</dt>
              <dd className="mt-1 text-sm text-foreground">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Last updated</dt>
              <dd className="mt-1 text-sm text-foreground">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '—'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
