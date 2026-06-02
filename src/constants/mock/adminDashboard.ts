export const adminDashboardMockMetrics = {
  totalUsers: { value: 2847, change: '+12.5%', positive: true },
  activeVendors: { value: 142, change: '+8.2%', positive: true },
  totalEvents: { value: 1394, change: '+23.1%', positive: true },
  revenue: { value: '$84.2k', change: '-2.4%', positive: false },
} as const;

export const adminRecentActivity = [
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
    initial: 'S',
    color: 'orange' as const,
    text: "Sarah Johnson Created new event 'Summer BBQ 2026'",
    timeAgo: '5 minutes ago',
  },
  {
    id: 'a7b8c9d0-e1f2-3456-0123-567890123456',
    initial: 'M',
    color: 'green' as const,
    text: 'Mike Davis Registered as vendor',
    timeAgo: '12 minutes ago',
  },
  {
    id: 'b8c9d0e1-f2a3-4567-1234-678901234567',
    initial: 'J',
    color: 'brown' as const,
    text: 'James Wilson RSVP confirmed for Family Dinner',
    timeAgo: '28 minutes ago',
  },
  {
    id: 'c9d0e1f2-a3b4-5678-2345-789012345678',
    initial: 'E',
    color: 'orange' as const,
    text: 'Emma Chen Updated vendor profile',
    timeAgo: '1 hour ago',
  },
  {
    id: 'd0e1f2a3-b4c5-6789-3456-890123456789',
    initial: 'T',
    color: 'green' as const,
    text: 'Tom Wilson New user registration',
    timeAgo: '2 hours ago',
  },
] as const;

export const adminQuickActions = [
  {
    id: 'e1f2a3b4-c5d6-7890-4567-901234567890',
    title: 'Manage Users',
    description: 'View all users',
    href: '/dashboard/admin/users',
    icon: 'users' as const,
  },
  {
    id: 'f2a3b4c5-d6e7-8901-5678-012345678901',
    title: 'Register Vendor',
    description: 'Add new vendor',
    href: '/dashboard/admin/register-vendor',
    icon: 'store' as const,
  },
  {
    id: 'a3b4c5d6-e7f8-9012-6789-123456789012',
    title: 'View Events',
    description: 'All platform events',
    href: '/dashboard/admin/events',
    icon: 'calendar' as const,
  },
] as const;

export const adminSystemHealth = [
  { id: 'b4c5d6e7-f8a9-0123-7890-234567890123', label: 'Server Status', status: 'Online', percent: 98 },
  { id: 'c5d6e7f8-a9b0-1234-8901-345678901234', label: 'Database', status: 'Healthy', percent: 95 },
  { id: 'd6e7f8a9-b0c1-2345-9012-456789012345', label: 'API Response', status: 'Fast', percent: 92 },
] as const;
