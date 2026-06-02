export const profileNotificationSettings = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    key: 'email' as const,
    title: 'Email Notifications',
    description: 'Get updates about events via email',
    defaultEnabled: true,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    key: 'push' as const,
    title: 'Push Notifications',
    description: 'Receive push notifications on your devices',
    defaultEnabled: true,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    key: 'sms' as const,
    title: 'SMS Notifications',
    description: 'Get text messages for important updates',
    defaultEnabled: false,
  },
] as const;

export const profilePrivacyLinks = [
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    title: 'Change Password',
    icon: 'shield' as const,
    href: '#',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-345678901234',
    title: 'Privacy Settings',
    icon: 'globe' as const,
    href: '#',
  },
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
    title: 'Connected Accounts',
    icon: 'user' as const,
    href: '#',
  },
] as const;

export const profilePreferenceFields = [
  { id: 'a7b8c9d0-e1f2-3456-0123-567890123456', key: 'language' as const, label: 'Language', placeholder: 'English' },
  { id: 'b8c9d0e1-f2a3-4567-1234-678901234567', key: 'timezone' as const, label: 'Timezone', placeholder: 'America/New_York' },
  { id: 'c9d0e1f2-a3b4-5678-2345-789012345678', key: 'dateFormat' as const, label: 'Date Format', placeholder: 'MM/DD/YYYY' },
] as const;
