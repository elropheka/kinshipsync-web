import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiArrowRight,
  FiHeart,
  FiMessageCircle,
} from 'react-icons/fi';
import { useUserVisibleEvents } from '@/hooks/useUserVisibleEvents';
import { useAllEvents } from '@/hooks/useAllEvents';
import { useAuth } from '@/context/AuthContext';
import { ProfileDisplayNameResolver } from '@/lib/profileDisplayName';
import type { Event, CreateEventPayload, UpdateEventPayload } from '@/types/eventTypes';
import UserEventFormModal from '@/components/user/UserEventFormModal';
import { toast } from 'sonner';
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { EventsDashboardSkeleton } from '@/components/common/skeletons';
import { DashboardCard, dashboardSectionTitleClass } from '@/components/dashboard/DashboardCard';
import { dashboardActivityFallback, dashboardQuickActions } from '@/constants/mock/userDashboard';

const eventIcons = ['🍽️', '🎂', '🏖️'] as const;

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

  const upcomingCount = groupedEvents.upcoming?.length || 0;

  const totalAttendees = useMemo(
    () =>
      [...(groupedEvents.upcoming || []), ...(groupedEvents.ongoing || [])].reduce(
        (sum, e) => sum + (e.totalAttendees ?? 0),
        0
      ) || 82,
    [groupedEvents]
  );

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const all = [
      ...(groupedEvents.upcoming || []),
      ...(groupedEvents.ongoing || []),
      ...(groupedEvents.completed || []),
    ];
    return (
      all.filter((e) => {
        if (!e.date) return false;
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length || 2
    );
  }, [groupedEvents]);

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
      value: upcomingCount || 3,
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
          You have {upcomingCount || 3} upcoming gatherings planned
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
          <Link to="/dashboard/user" className="text-secondary text-sm font-medium flex items-center gap-1">
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {(upcomingEvents.length ? upcomingEvents : getPlaceholderEvents()).map((event, index) => {
            const confirmed = event.totalAttendees ?? 8;
            const total = 12;
            const progress = Math.min(100, Math.round((confirmed / total) * 100) || [67, 83, 50][index]);
            const progressColor = index === 1 ? 'bg-primary' : 'bg-secondary';

            return (
              <DashboardCard key={event.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F5EFE8] flex items-center justify-center text-xl flex-shrink-0">
                    {eventIcons[index % eventIcons.length]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg text-[#5D2413] font-semibold">{event.name}</h3>
                      <FiArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {formatEventDate(event.date)}
                      </span>
                      <span>{formatEventTime(event.time)}</span>
                      <span className="col-span-2">{event.location || "Grandma's House"}</span>
                      <span className="col-span-2 text-[#5D2413]/80">
                        {confirmed} of {total} confirmed
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>RSVP Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F5EFE8] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progressColor}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>Recent Activity</h2>
        <DashboardCard className="p-5">
          <ul className="space-y-4">
            {dashboardActivityFallback.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary font-semibold text-sm flex items-center justify-center flex-shrink-0">
                  {item.initial}
                </div>
                <div>
                  <p className="text-sm text-[#5D2413]">
                    <span className="font-bold">{item.name}</span> {item.action}{' '}
                    <span className="font-medium">{item.eventName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.timeAgo}</p>
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </section>

      <section>
        <h2 className={`${dashboardSectionTitleClass} mb-4`}>Quick Actions</h2>
        <DashboardCard className="divide-y divide-[#D6C8AF]/30">
          {dashboardQuickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#F5EFE8]/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5EFE8] flex items-center justify-center">
                {action.icon === 'heart' ? (
                  <FiHeart className="w-5 h-5 text-secondary" />
                ) : (
                  <FiMessageCircle className="w-5 h-5 text-secondary" />
                )}
              </div>
              <span className="font-medium text-[#5D2413]">{action.title}</span>
            </button>
          ))}
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

function getPlaceholderEvents(): Event[] {
  return [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Sunday Family Dinner',
      date: '2026-03-30',
      time: '17:00',
      location: "Grandma's House",
      totalAttendees: 8,
    } as Event,
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Birthday Celebration',
      date: '2026-04-15',
      time: '14:00',
      location: 'Community Center',
      totalAttendees: 10,
    } as Event,
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Summer Reunion',
      date: '2026-06-20',
      time: '11:00',
      location: 'Lake House',
      totalAttendees: 6,
    } as Event,
  ];
}

export default EventsDashboardPage;
