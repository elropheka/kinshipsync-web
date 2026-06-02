import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { useUserVisibleEvents } from '@/hooks/useUserVisibleEvents';
import { useAllEvents } from '@/hooks/useAllEvents';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { ProfileDisplayNameResolver } from '@/lib/profileDisplayName';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import type { CreateEventPayload, UpdateEventPayload } from '@/types/eventTypes';
import UserEventFormModal from '@/components/user/UserEventFormModal';
import { toast } from 'sonner';
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { EventsDashboardSkeleton } from '@/components/common/skeletons';
import { DashboardCard, dashboardSectionTitleClass } from '@/components/dashboard/DashboardCard';

const formatEventDate = (date?: string) => {
  if (!date) return 'Date TBD';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatEventTime = (time?: string) => {
  if (!time) return 'Time TBD';
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const EventsDashboardPage: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const { groupedEvents, isLoading, error, refetchEvents } = useUserVisibleEvents();
  const { addEvent, isLoading: isProcessingEvent } = useAllEvents();
  const { notifications, loading: notificationsLoading } = useNotifications();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useErrorToast(error, { title: 'Unable to load events' });

  const greetingName = ProfileDisplayNameResolver.greetingName(
    userProfile,
    currentUser?.displayName
  );

  const upcomingEvents = useMemo(
    () => (groupedEvents.upcoming || []).slice(0, 3),
    [groupedEvents.upcoming]
  );

  const upcomingCount = groupedEvents.upcoming?.length ?? 0;

  const totalAttendees = useMemo(
    () =>
      [...(groupedEvents.upcoming || []), ...(groupedEvents.ongoing || [])].reduce(
        (sum, e) => sum + (e.totalAttendees ?? 0),
        0
      ),
    [groupedEvents]
  );

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const all = [
      ...(groupedEvents.upcoming || []),
      ...(groupedEvents.ongoing || []),
      ...(groupedEvents.completed || []),
    ];
    return all.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [groupedEvents]);

  const recentNotifications = useMemo(
    () => notifications.slice(0, 5),
    [notifications]
  );

  const handleModalSubmit = async (data: CreateEventPayload | UpdateEventPayload) => {
    const eventData = data as CreateEventPayload;
    const { website: websiteData, ...cleanEventData } = eventData;
    const success = !!(await addEvent(cleanEventData, websiteData));
    if (success) {
      toast.success('Event created successfully.');
      setIsEventModalOpen(false);
      refetchEvents();
    } else {
      toast.error('Failed to create event.');
    }
  };

  if (isLoading) return <EventsDashboardSkeleton />;

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Unable to load events"
        onRetry={refetchEvents}
        retryLabel="Try Again"
      />
    );
  }

  const statCards = [
    {
      label: 'Upcoming Events',
      value: upcomingCount,
      icon: FiCalendar,
      iconBg: 'bg-secondary/15',
      iconColor: 'text-secondary',
    },
    {
      label: 'Total Attendees',
      value: totalAttendees,
      icon: FiUsers,
      iconBg: 'bg-primary/15',
      iconColor: 'text-primary',
    },
    {
      label: 'This Month',
      value: thisMonthCount,
      icon: FiTrendingUp,
      iconBg: 'bg-secondary/15',
      iconColor: 'text-secondary',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-[#5D2413] mb-2">
          Welcome back, {greetingName} 👋
        </h1>
        <p className="text-muted-foreground">
          {upcomingCount === 0
            ? 'No upcoming gatherings planned yet'
            : `You have ${upcomingCount} upcoming gathering${upcomingCount === 1 ? '' : 's'} planned`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <DashboardCard key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="font-display text-3xl text-[#5D2413] font-bold">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={dashboardSectionTitleClass}>Upcoming Events</h2>
          {upcomingCount > 0 && (
            <Link
              to="/dashboard/user/events"
              className="text-secondary text-sm font-medium flex items-center gap-1"
            >
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {upcomingEvents.length === 0 ? (
          <DashboardCard className="p-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">No upcoming events yet.</p>
            <Link
              to="/dashboard/user/events/create"
              className="inline-flex items-center gap-2 rounded-full bg-[#E08433] hover:bg-[#CC742B] text-white text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              Create your first event
            </Link>
          </DashboardCard>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => {
              const confirmed = event.totalAttendees ?? 0;

              return (
                <Link key={event.id} to={`/dashboard/events/${event.id}`}>
                  <DashboardCard className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F5EFE8] flex items-center justify-center flex-shrink-0">
                        <FiCalendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-lg text-[#5D2413] font-semibold">
                            {event.name}
                          </h3>
                          <FiArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {formatEventDate(event.date)}
                          </span>
                          <span>{formatEventTime(event.time)}</span>
                          {event.location && (
                            <span className="col-span-2">{event.location}</span>
                          )}
                          {confirmed > 0 && (
                            <span className="col-span-2 text-[#5D2413]/80">
                              {confirmed} confirmed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </DashboardCard>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>Recent Activity</h2>
        <DashboardCard className="p-5">
          {notificationsLoading ? (
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          ) : recentNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          ) : (
            <ul className="space-y-4">
              {recentNotifications.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary font-semibold text-sm flex items-center justify-center flex-shrink-0">
                    {item.title.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-[#5D2413]">
                      <span className="font-bold">{item.title}</span>
                      {item.body ? ` — ${item.body}` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </section>

      <UserEventFormModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={handleModalSubmit}
        isProcessing={isProcessingEvent}
        mode="create"
      />
    </div>
  );
};

export default EventsDashboardPage;
