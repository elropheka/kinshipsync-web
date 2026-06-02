import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiChevronRight,
} from 'react-icons/fi';
import { useAllUsers } from '@/hooks/useAllUsers';
import { useAllVendors } from '@/hooks/useAllVendors';
import { useAllEvents } from '@/hooks/useAllEvents';
import { AdminDashboardSkeleton } from '@/components/common/skeletons';
import { DashboardCard, dashboardSectionTitleClass } from '@/components/dashboard/DashboardCard';
import {
  adminDashboardMockMetrics,
  adminRecentActivity,
  adminQuickActions,
  adminSystemHealth,
} from '@/constants/mock/adminDashboard';

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

  const metrics = [
    {
      label: 'Total Users',
      value: isLoadingUsers ? '...' : usersError ? '—' : users.length || adminDashboardMockMetrics.totalUsers.value,
      change: adminDashboardMockMetrics.totalUsers.change,
      positive: adminDashboardMockMetrics.totalUsers.positive,
      icon: FiUsers,
      iconBg: 'bg-secondary/15',
      iconColor: 'text-secondary',
    },
    {
      label: 'Active Vendors',
      value: isLoadingVendors ? '...' : vendorsError ? '—' : vendors.length || adminDashboardMockMetrics.activeVendors.value,
      change: adminDashboardMockMetrics.activeVendors.change,
      positive: adminDashboardMockMetrics.activeVendors.positive,
      icon: FiBriefcase,
      iconBg: 'bg-primary/15',
      iconColor: 'text-primary',
    },
    {
      label: 'Total Events',
      value: isLoadingEvents ? '...' : eventsError ? '—' : allEvents.length || adminDashboardMockMetrics.totalEvents.value,
      change: adminDashboardMockMetrics.totalEvents.change,
      positive: adminDashboardMockMetrics.totalEvents.positive,
      icon: FiCalendar,
      iconBg: 'bg-secondary/15',
      iconColor: 'text-secondary',
    },
    {
      label: 'Revenue',
      value: adminDashboardMockMetrics.revenue.value,
      change: adminDashboardMockMetrics.revenue.change,
      positive: adminDashboardMockMetrics.revenue.positive,
      icon: FiDollarSign,
      iconBg: 'bg-primary/15',
      iconColor: 'text-primary',
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
        <h1 className="font-display text-3xl text-[#5D2413] mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of platform activity and metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <DashboardCard key={metric.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${metric.iconBg} flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
              <span
                className={`text-xs font-medium ${
                  metric.positive ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="font-display text-2xl text-[#5D2413] font-bold">{metric.value}</p>
          </DashboardCard>
        ))}
      </div>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>Recent Activity</h2>
        <DashboardCard className="p-5">
          <ul className="space-y-4">
            {adminRecentActivity.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                    item.color === 'green'
                      ? 'bg-primary/20 text-primary'
                      : item.color === 'orange'
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-[#5D2413]/10 text-[#5D2413]'
                  }`}
                >
                  {item.initial}
                </div>
                <div>
                  <p className="text-sm text-[#5D2413]">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.timeAgo}</p>
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </section>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>Top Events</h2>
        <DashboardCard className="divide-y divide-[#D6C8AF]/30">
          {(topEvents.length ? topEvents : []).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-5 gap-4">
              <div>
                <p className="font-semibold text-[#5D2413]">{event.name}</p>
                <p className="text-xs text-muted-foreground">
                  {event.totalAttendees ?? 0} attendees •{' '}
                  {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'}
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
        <DashboardCard className="divide-y divide-[#D6C8AF]/30">
          {adminQuickActions.map((action) => (
            <Link
              key={action.id}
              to={action.href}
              className="flex items-center justify-between p-5 hover:bg-[#F5EFE8]/50 transition-colors"
            >
              <div>
                <p className="font-medium text-[#5D2413]">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </DashboardCard>
      </section>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>System Health</h2>
        <DashboardCard className="p-5 space-y-5">
          {adminSystemHealth.map((item) => (
            <div key={item.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#5D2413]">{item.label}</span>
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {item.status}
                </span>
              </div>
              <div className="h-2 bg-[#F5EFE8] rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </DashboardCard>
      </section>
    </div>
  );
};

export default AdminDashboard;
