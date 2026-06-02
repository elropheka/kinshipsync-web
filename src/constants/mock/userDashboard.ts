export const dashboardQuickActions = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Share a Memory',
    icon: 'heart' as const,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    title: 'Family Chat',
    icon: 'chat' as const,
  },
] as const;

export const dashboardActivityFallback = [
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    initial: 'S',
    name: 'Sarah',
    action: 'confirmed attendance',
    eventName: 'Sunday Family Dinner',
    timeAgo: '2 hours ago',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    initial: 'M',
    name: 'Marcus',
    action: 'RSVP maybe for',
    eventName: 'Birthday Celebration',
    timeAgo: '5 hours ago',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-345678901234',
    initial: 'G',
    name: 'Grandma',
    action: 'sent a message in',
    eventName: 'Summer Reunion',
    timeAgo: '1 day ago',
  },
] as const;

export const eventIconTypes = ['dinner', 'birthday', 'reunion'] as const;
