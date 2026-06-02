import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '@/services/firebaseConfig';
import type { UpdateUserSettingsPayload, UserSettings } from '@/types/userSettingsTypes';

const defaultSettings = (): Omit<UserSettings, 'userId' | 'updatedAt'> => ({
  theme: 'system',
  language: 'en',
  emailNotifications: {
    eventInvites: true,
    eventUpdates: true,
    messageAlerts: true,
    newsletter: false,
  },
  pushNotifications: {
    eventInvites: true,
    eventUpdates: true,
    messageAlerts: true,
    taskAlerts: true,
  },
  eventVisibility: {
    showAllPublicEvents: false,
  },
});

export class UserSettingsService {
  private static settingsDocRef(userId: string) {
    return doc(firestore, 'users', userId, 'settings', 'appSettings');
  }

  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    if (!userId) return null;

    const settingsDocRef = this.settingsDocRef(userId);
    const docSnap = await getDoc(settingsDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        userId,
        theme: data.theme ?? 'system',
        language: data.language ?? 'en',
        emailNotifications: {
          eventInvites: data.emailNotifications?.eventInvites ?? true,
          eventUpdates: data.emailNotifications?.eventUpdates ?? true,
          messageAlerts: data.emailNotifications?.messageAlerts ?? true,
          newsletter: data.emailNotifications?.newsletter ?? false,
        },
        pushNotifications: {
          eventInvites: data.pushNotifications?.eventInvites ?? true,
          eventUpdates: data.pushNotifications?.eventUpdates ?? true,
          messageAlerts: data.pushNotifications?.messageAlerts ?? true,
          taskAlerts: data.pushNotifications?.taskAlerts ?? true,
        },
        eventVisibility: {
          showAllPublicEvents: data.eventVisibility?.showAllPublicEvents ?? false,
        },
        updatedAt:
          (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      };
    }

    const defaults = defaultSettings();
    await setDoc(settingsDocRef, { ...defaults, updatedAt: serverTimestamp() });
    return {
      userId,
      ...defaults,
      updatedAt: new Date().toISOString(),
    };
  }

  static async updateUserSettings(
    userId: string,
    payload: UpdateUserSettingsPayload
  ): Promise<UserSettings | null> {
    if (!userId) return null;

    const settingsDocRef = this.settingsDocRef(userId);
    await updateDoc(settingsDocRef, { ...payload, updatedAt: serverTimestamp() });
    return this.getUserSettings(userId);
  }
}
