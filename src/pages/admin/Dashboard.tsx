import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
} from 'react-icons/fi';
import { useAllUsers } from '@/hooks/useAllUsers';
import { useAllVendors } from '@/hooks/useAllVendors';
import { useAllEvents } from '@/hooks/useAllEvents';
import { AdminDashboardSkeleton } from '@/components/common/skeletons';
import { DashboardCard, dashboardSectionTitleClass } from '@/components/dashboard/DashboardCard';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import type { UserProfile } from '@/types/userTypes';
import type { Event } from '@/types/eventTypes';

const adminQuickActions = [
  {
    id: 'e1f2a3b4-c5d6-7890-4567-901234567890',
    title: 'Manage Users',
    description: 'View all users',
    href: '/dashboard/admin/users',
  },
  {
    id: 'f2a3b4c5-d6e7-8901-5678-012345678901',
    title: 'Register Vendor',
    description: 'Add new vendor',
    href: '/dashboard/admin/register-vendor',
  },
  {
    id: 'a3b4c5d6-e7f8-9012-6789-123456789012',
    title: 'View Events',
    description: 'All platform events',
    href: '/dashboard/admin/events',
  },
] as const;

const getDisplayName = (user: UserProfile) =>
  user.displayName ||
  [user.firstName, user.lastName].filter(Boolean).join(' ') ||
  user.email ||
  'User';

interface ActivityItem {
  id: string;
  initial: string;
  color: 'green' | 'orange' | 'brown';
  text: string;
  timeAgo: string;
  sortKey: number;
}

const AdminDashboard: React.FC = () => {
  const { users, isLoading: isLoadingUsers, error: usersError } = useAllUsers();
  const { vendors, isLoading: isLoadingVendors, error: vendorsError } = useAllVendors();
  const { allEvents, isLoading: isLoadingEvents, error: eventsError } = useAllEvents();

  const isLoading = isLoadingUsers || isLoadingVendors || isLoadingEvents;

  const topEvents = useMemo(() => {
    if (!allEvents?.length) return [];
    return [...allEvents]
      .sort((a, b) => (b.totalAttendees ?? 0) - (a.totalAttendees ?? 0))
      .slice(0, 4);
  }, [allEvents]);

  const recentActivity = useMemo(() => {
    const items: ActivityItem[] = [];

    users.slice(0, 5).forEach((user) => {
      const createdAt = new Date(user.createdAt).getTime();
      if (Number.isNaN(createdAt)) return;
      items.push({
        id: `user-${user.userId}`,
        initial: getDisplayName(user).charAt(0).toUpperCase(),
        color: 'green',
        text: `${getDisplayName(user)} joined the platform`,
        timeAgo: formatRelativeTime(createdAt),
        sortKey: createdAt,
      });
    });

    (allEvents || []).slice(0, 5).forEach((event: Event) => {
      const createdAt = new Date(event.createdAt).getTime();
      if (Number.isNaN(createdAt)) return;
      items.push({
        id: `event-${event.id}`,
        initial: event.name.charAt(0).toUpperCase(),
        color: 'orange',
        text: `New event "${event.name}" was created`,
        timeAgo: formatRelativeTime(createdAt),
        sortKey: createdAt,
      });
    });

    vendors.slice(0, 5).forEach((vendor) => {
      const createdAt = new Date(vendor.createdAt).getTime();
      if (Number.isNaN(createdAt)) return;
      items.push({
        id: `vendor-${vendor.id}`,
        initial: (vendor.name || 'V').charAt(0).toUpperCase(),
        color: 'brown',
        text: `Vendor "${vendor.name}" was registered`,
        timeAgo: formatRelativeTime(createdAt),
        sortKey: createdAt,
      });
    });

    return items.sort((a, b) => b.sortKey - a.sortKey).slice(0, 5);
  }, [users, allEvents, vendors]);

  const metrics = [
    {
      label: 'Total Users',
      value: isLoadingUsers ? '...' : usersError ? '—' : users.length,
      icon: FiUsers,
      iconBg: 'bg-secondary/15',
      iconColor: 'text-secondary',
    },
    {
      label: 'Active Vendors',
      value: isLoadingVendors ? '...' : vendorsError ? '—' : vendors.length,
      icon: FiBriefcase,
      iconBg: 'bg-primary/15',
      iconColor: 'text-primary',
    },
    {
      label: 'Total Events',
      value: isLoadingEvents ? '...' : eventsError ? '—' : allEvents.length,
      icon: FiCalendar,
      iconBg: 'bg-secondary/15',
      iconColor: 'text-secondary',
    },
  ];

  if (isLoading && users.length === 0 && vendors.length === 0) {
    return <AdminDashboardSkeleton />;
  }

  const statusColors: Record<string, string> = {
    upcoming: 'bg-yellow-100 text-yellow-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div>
        <h1 className="font-display text-3xl text-foreground mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of platform activity and metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <DashboardCard key={metric.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${metric.iconBg} flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="font-display text-2xl text-foreground font-bold">{metric.value}</p>
          </DashboardCard>
        ))}
      </div>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>Recent Activity</h2>
        <DashboardCard className="p-5">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          ) : (
            <ul className="space-y-4">
              {recentActivity.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                      item.color === 'green'
                        ? 'bg-primary/20 text-primary'
                        : item.color === 'orange'
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-foreground/10 text-foreground'
                    }`}
                  >
                    {item.initial}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.timeAgo}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </section>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>Top Events</h2>
        <DashboardCard className="divide-y divide-border/30">
          {topEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-5 gap-4">
              <div>
                <p className="font-semibold text-foreground">{event.name}</p>
                <p className="text-xs text-muted-foreground">
                  {event.totalAttendees ?? 0} attendees •{' '}
                  {event.date
                    ? new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'TBD'}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                  statusColors[event.status || 'active'] || statusColors.active
                }`}
              >
                {event.status || 'Active'}
              </span>
            </div>
          ))}
          {!topEvents.length && (
            <p className="p-5 text-sm text-muted-foreground">No events to display yet.</p>
          )}
        </DashboardCard>
      </section>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>Quick Actions</h2>
        <DashboardCard className="divide-y divide-border/30">
          {adminQuickActions.map((action) => (
            <Link
              key={action.id}
              to={action.href}
              className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="font-medium text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </DashboardCard>
      </section>
    </div>
  );
};

export default AdminDashboard;
