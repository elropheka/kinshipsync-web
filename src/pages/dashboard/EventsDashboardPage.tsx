import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUserVisibleEvents } from '@/hooks/useUserVisibleEvents';
import { useAllEvents } from '@/hooks/useAllEvents';
import { useAllThemes } from '@/hooks/useAllThemes';
import { useAuth } from '@/context/AuthContext';
import { ProfileDisplayNameResolver } from '@/lib/profileDisplayName';
import type { Event, CreateEventPayload, UpdateEventPayload } from '@/types/eventTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import UserEventFormModal from '@/components/user/UserEventFormModal';
import { toast } from "sonner";
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { OrganizerDisplay } from '@/components/common/OrganizerDisplay';
import {
  PlusCircle,
  TrendingUp,
  CheckCircle,
  CalendarClock,
  ListChecks,
  Palette,
  Sparkles,
  Activity,
  ArrowRight,
  User,
} from 'lucide-react';

const brandCardClass =
  'rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <Card className={`mb-4 ${brandCardClass}`}>
      <CardHeader>
        <CardTitle className="text-foreground">{event?.name || 'Unnamed Event'}</CardTitle>
        <CardDescription>
          {event?.date ? new Date(event.date).toLocaleDateString() : 'Date not set'}
          {event?.location && ` - ${event.location}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
          {event?.description || "No description available."}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {event?.status && (
            <Badge variant={
              event.status === 'ongoing' ? 'default' :
              event.status === 'completed' ? 'secondary' :
              event.status === 'upcoming' ? 'outline' :
              'destructive'
            } className="capitalize">
              {event.status}
            </Badge>
          )}
          {event?.visibility && (
            <Badge variant="secondary" className="capitalize">{event.visibility}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {event?.organizerId ? (
          <OrganizerDisplay organizerId={event.organizerId} />
        ) : (
          <p className="text-xs text-muted-foreground">Organized by: Unknown</p>
        )}
      </CardFooter>
    </Card>
  );
};

const EventGroup: React.FC<{ title: string; events: Event[] }> = ({ title, events }) => {
  if (events.length === 0) {
    return null;
  }
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  );
};

const EventsDashboardPage: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const { groupedEvents, isLoading: isLoadingEventsData, error: eventsError, refetchEvents } = useUserVisibleEvents();
  const { addEvent, isLoading: isProcessingEvent } = useAllEvents();
  const { allThemes: themes, isLoading: isLoadingThemes, error: themesError } = useAllThemes();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const isLoading = isLoadingEventsData || isLoadingThemes;
  const error = eventsError || themesError;

  useErrorToast(error, { title: 'Unable to load events' });

  const greetingName = ProfileDisplayNameResolver.greetingName(
    userProfile,
    currentUser?.displayName
  );

  const eventCounts = useMemo(() => {
    const ongoing = groupedEvents.ongoing?.length || 0;
    const upcoming = groupedEvents.upcoming?.length || 0;
    const completed = groupedEvents.completed?.length || 0;
    const other = groupedEvents.other?.length || 0;
    const total = ongoing + upcoming + completed + other;
    return { total, ongoing, upcoming, completed, other };
  }, [groupedEvents]);

  const allUserEvents = useMemo(
    () => [
      ...(groupedEvents.ongoing || []),
      ...(groupedEvents.upcoming || []),
      ...(groupedEvents.completed || []),
      ...(groupedEvents.other || []),
    ],
    [groupedEvents]
  );

  const upcomingPreview = useMemo(
    () => (groupedEvents.upcoming || []).slice(0, 4),
    [groupedEvents.upcoming]
  );

  const recentActivity = useMemo(
    () =>
      [...allUserEvents]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [allUserEvents]
  );

  const popularThemes = useMemo(() => {
    if (isLoadingThemes || !themes || !themes.length || isLoadingEventsData) return [];

    const themeCounts: Record<string, { name: string; count: number }> = {};

    allUserEvents.forEach(event => {
      if (event.themeId) {
        const themeDetail = themes.find((t: { id: string; name: string }) => t.id === event.themeId);
        if (themeDetail) {
          if (themeCounts[event.themeId]) {
            themeCounts[event.themeId].count++;
          } else {
            themeCounts[event.themeId] = { name: themeDetail.name, count: 1 };
          }
        }
      }
    });
    return Object.values(themeCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [allUserEvents, themes, isLoadingThemes, isLoadingEventsData]);

  const handleOpenCreateModal = () => {
    setIsEventModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEventModalOpen(false);
  };

  const handleModalSubmit = async (data: CreateEventPayload | UpdateEventPayload) => {
    const eventData = data as CreateEventPayload;
    const websiteData = eventData.website;
    const { ...cleanEventData } = eventData;

    const success = !!(await addEvent(cleanEventData, websiteData));
    if (success) {
      toast.success("Event created successfully.");
      handleModalClose();
      refetchEvents();
    } else {
      toast.error("Failed to create event.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-background">
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Unable to load events"
        onRetry={refetchEvents}
        retryLabel="Try Again"
        className="bg-background"
      />
    );
  }

  const hasEvents = Object.values(groupedEvents).some(group => group.length > 0);

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10 space-y-8 bg-background">
      {/* Welcome */}
      <div className={`${brandCardClass} overflow-hidden`}>
        <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Welcome back
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Hi, {greetingName}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Plan family gatherings, track RSVPs, and keep everyone in sync from one warm, organized place.
              </p>
            </div>
            <Button
              onClick={handleOpenCreateModal}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full shrink-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className={brandCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Events</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <ListChecks className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoadingEventsData ? "..." : eventCounts.total}</div>
            <p className="text-xs text-muted-foreground">All your visible events</p>
          </CardContent>
        </Card>
        <Card className={brandCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Ongoing</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoadingEventsData ? "..." : eventCounts.ongoing}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card className={brandCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Upcoming</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-secondary/15 flex items-center justify-center">
              <CalendarClock className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoadingEventsData ? "..." : eventCounts.upcoming}</div>
            <p className="text-xs text-muted-foreground">Planned for the future</p>
          </CardContent>
        </Card>
        <Card className={brandCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Completed</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoadingEventsData ? "..." : eventCounts.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully concluded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming events */}
        <Card className={`lg:col-span-2 ${brandCardClass}`}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Your next gatherings on the calendar</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingPreview.length > 0 ? (
              <ul className="space-y-3">
                {upcomingPreview.map(event => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{event.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                        {event.location ? ` · ${event.location}` : ''}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize shrink-0 border-primary/30 text-primary">
                      {event.status || 'upcoming'}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming events yet. Create one to get started.</p>
            )}
          </CardContent>
        </Card>

        {/* Popular themes */}
        <Card className={brandCardClass}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Popular Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-xs text-muted-foreground">Loading themes...</p>
            ) : popularThemes.length > 0 ? (
              <ul className="space-y-2">
                {popularThemes.map(theme => (
                  <li key={theme.name} className="text-sm flex justify-between text-foreground">
                    <span>{theme.name}</span>
                    <Badge variant="secondary">{theme.count} use{theme.count > 1 ? 's' : ''}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No themes used yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <Card className={brandCardClass}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across your events</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {recentActivity.map(event => (
                  <li key={event.id} className="flex justify-between gap-2 text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="font-medium text-foreground truncate">{event.name}</span>
                    <span className="text-muted-foreground shrink-0">
                      {new Date(event.updatedAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className={brandCardClass}>
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              onClick={handleOpenCreateModal}
              className="w-full justify-between bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl"
            >
              Create new event
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" className="w-full justify-between rounded-xl border-primary/30 text-primary hover:bg-primary/5">
              <Link to="/dashboard/user">
                View all my events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between rounded-xl border-border hover:bg-muted/50">
              <Link to="/dashboard/user/profile">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Edit profile
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {!hasEvents && !isLoading && (
        <div className={`text-center py-10 ${brandCardClass}`}>
          <h2 className="text-xl font-semibold text-foreground mb-2">No Events to Display</h2>
          <p className="text-muted-foreground mb-4">
            It looks like you don&apos;t have any events yet. Why not create one?
          </p>
          <Button
            onClick={handleOpenCreateModal}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      )}

      {hasEvents && (
        <>
          <EventGroup title="Ongoing Events" events={groupedEvents.ongoing} />
          <EventGroup title="Upcoming Events" events={groupedEvents.upcoming} />
          <EventGroup title="Completed Events" events={groupedEvents.completed} />
          {groupedEvents.other.length > 0 && (
            <EventGroup title="Other Events" events={groupedEvents.other} />
          )}
        </>
      )}

      <UserEventFormModal
        isOpen={isEventModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        isProcessing={isProcessingEvent}
        mode="create"
      />
    </div>
  );
};

export default EventsDashboardPage;
