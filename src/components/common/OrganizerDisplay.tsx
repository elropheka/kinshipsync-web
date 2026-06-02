import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileDisplayNameResolver } from '@/lib/profileDisplayName';
import { InlineTextSkeleton } from '@/components/common/skeletons';

interface OrganizerDisplayProps {
  organizerId: string;
}

export const OrganizerDisplay: React.FC<OrganizerDisplayProps> = ({ organizerId }) => {
  const { userProfile, isLoading, error } = useUserProfile(organizerId);

  if (isLoading) {
    return (
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        Organized by: <InlineTextSkeleton width="w-20" />
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-xs text-muted-foreground">
        Organized by: {ProfileDisplayNameResolver.fromProfile(null, organizerId)}
      </p>
    );
  }

  return (
    <p className="text-xs text-muted-foreground">
      Organized by: {ProfileDisplayNameResolver.fromProfile(userProfile, organizerId)}
    </p>
  );
};
