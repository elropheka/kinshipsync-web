import type { UserProfile } from '@/types/userTypes';

type NameFields = Pick<UserProfile, 'firstName' | 'lastName' | 'displayName'>;

export class ProfileDisplayNameResolver {
  static fromProfile(
    profile: NameFields | null | undefined,
    fallbackId?: string
  ): string {
    if (!profile) {
      return fallbackId?.trim() || 'Unknown';
    }

    const fromParts = [profile.firstName, profile.lastName]
      .filter((part): part is string => Boolean(part?.trim()))
      .join(' ')
      .trim();

    if (fromParts) {
      return fromParts;
    }

    const display = profile.displayName?.trim();
    if (display) {
      return display;
    }

    return fallbackId?.trim() || 'Unknown';
  }
}
