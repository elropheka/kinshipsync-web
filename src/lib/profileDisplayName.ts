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

  /** First-name style label for dashboard greetings (e.g. "Hi, El"). */
  static greetingName(
    profile: NameFields | null | undefined,
    authDisplayName?: string | null
  ): string {
    if (profile?.firstName?.trim()) {
      return profile.firstName.trim();
    }

    const authFirst = authDisplayName?.split(' ')[0]?.trim();
    if (authFirst) {
      return authFirst;
    }

    const full = ProfileDisplayNameResolver.fromProfile(profile, undefined);
    if (full !== 'Unknown') {
      return full.split(' ')[0] || full;
    }

    return 'there';
  }
}
