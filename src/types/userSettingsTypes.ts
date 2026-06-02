export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: {
    eventInvites: boolean;
    eventUpdates: boolean;
    messageAlerts: boolean;
    newsletter: boolean;
  };
  pushNotifications: {
    eventInvites: boolean;
    eventUpdates: boolean;
    messageAlerts: boolean;
    taskAlerts: boolean;
  };
  eventVisibility: {
    showAllPublicEvents: boolean;
  };
  updatedAt: string;
}

export type UpdateUserSettingsPayload = Partial<Omit<UserSettings, 'userId' | 'updatedAt'>>;
