import React, { useState, useMemo } from 'react'; // Added useMemo
import { useUserVisibleEvents } from '@/hooks/useUserVisibleEvents';
import { useAllEvents } from '@/hooks/useAllEvents'; // For addEvent
import { useAllThemes } from '@/hooks/useAllThemes'; // Import useAllThemes
import type { Event, CreateEventPayload, UpdateEventPayload } from '@/types/eventTypes'; // Added CreateEventPayload, UpdateEventPayload
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import UserEventFormModal from '@/components/user/UserEventFormModal'; // Import the modal
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { PlusCircle, TrendingUp, CheckCircle, CalendarClock, ListChecks, Palette } from 'lucide-react'; // Added icons

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{event?.name || 'Unnamed Event'}</CardTitle>
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
        <p className="text-xs text-muted-foreground">
          Organized by: {event?.organizerId || 'Unknown'}
        </p>
      </CardFooter>
    </Card>
  );
};

const EventGroup: React.FC<{ title: string; events: Event[] }> = ({ title, events }) => {
  if (events.length === 0) {
    return null; // Don't render the group if there are no events
  }
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  );
};

const EventsDashboardPage: React.FC = () => {
  const { groupedEvents, isLoading: isLoadingEventsData, error: eventsError, refetchEvents } = useUserVisibleEvents();
  const { addEvent, isLoading: isProcessingEvent } = useAllEvents(); // For creating events
  const { allThemes: themes, isLoading: isLoadingThemes, error: themesError } = useAllThemes(); // Corrected destructuring

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const isLoading = isLoadingEventsData || isLoadingThemes;
  const error = eventsError || themesError;

  const eventCounts = useMemo(() => {
    const ongoing = groupedEvents.ongoing?.length || 0;
    const upcoming = groupedEvents.upcoming?.length || 0;
    const completed = groupedEvents.completed?.length || 0;
    const other = groupedEvents.other?.length || 0;
    const total = ongoing + upcoming + completed + other;
    return { total, ongoing, upcoming, completed, other };
  }, [groupedEvents]);

  const popularThemes = useMemo(() => {
    if (isLoadingThemes || !themes || !themes.length || isLoadingEventsData) return []; // Added check for themes itself

    const allUserEvents = [
      ...(groupedEvents.ongoing || []),
      ...(groupedEvents.upcoming || []),
      ...(groupedEvents.completed || []),
      ...(groupedEvents.other || []),
    ];

    const themeCounts: Record<string, { name: string; count: number }> = {};

    allUserEvents.forEach(event => {
      if (event.themeId) {
        const themeDetail = themes.find((t: { id: string; name: string }) => t.id === event.themeId); // Added type for t
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
      .slice(0, 3); // Show top 3
  }, [groupedEvents, themes, isLoadingThemes, isLoadingEventsData]);

  const handleOpenCreateModal = () => {
    // setEditingEvent(null); // Not needed for create-only on this page
    // setModalMode('create'); // Always create from this page's button
    setIsEventModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEventModalOpen(false);
  };

  const handleModalSubmit = async (data: CreateEventPayload | UpdateEventPayload) => {
    // This page's modal is only for creation
    const eventData = data as CreateEventPayload;
    const websiteData = eventData.website;
    
    // Remove website from eventData since addEvent expects it as separate parameter
    const { ...cleanEventData } = eventData;
    
    const success = !!(await addEvent(cleanEventData, websiteData));
    if (success) {
      toast.success("Event created successfully.");
      handleModalClose();
      refetchEvents(); // Refetch events to include the new one
    } else {
      toast.error("Failed to create event.");
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><p>Loading events...</p></div>;
  }

  if (error) {
    toast.error(getErrorMessage(error));
    return (
      <div className="flex flex-col justify-center items-center h-full p-4">
        <p className="text-muted-foreground mb-4">Unable to load events. Please try again.</p>
        <Button onClick={refetchEvents} className="mt-4">Try Again</Button>
      </div>
    );
  }
  
  const hasEvents = Object.values(groupedEvents).some(group => group.length > 0);

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events Dashboard</h1>
        <Button onClick={handleOpenCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      {/* Event Stats Overview & Popular Themes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Total Events Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingEventsData ? "..." : eventCounts.total}</div>
            <p className="text-xs text-muted-foreground">All your visible events</p>
          </CardContent>
        </Card>

        {/* Popular Themes Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Themes</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? ( 
              <p className="text-xs text-muted-foreground">Loading themes...</p>
            ) : popularThemes.length > 0 ? (
              <ul className="space-y-1">
                {popularThemes.map(theme => (
                  <li key={theme.name} className="text-sm flex justify-between">
                    <span>{theme.name}</span>
                    <Badge variant="secondary">{theme.count} use{theme.count > 1 ? 's' : ''}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No themes used yet or themes data not available.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Event Status Specific Cards - moved below popular themes for better layout */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingEventsData ? "..." : eventCounts.ongoing}</div>
             <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingEventsData ? "..." : eventCounts.upcoming}</div>
            <p className="text-xs text-muted-foreground">Planned for the future</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingEventsData ? "..." : eventCounts.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully concluded</p>
          </CardContent>
        </Card>
      </div>

      {!hasEvents && !isLoading && ( 
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No Events to Display</h2>
          <p className="text-muted-foreground">
            It looks like you don't have any events yet. Why not create one?
          </p>
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
        mode="create" // This modal instance is always for creation
        // event prop is not needed for create mode
      />
    </div>
  );
};

export default EventsDashboardPage;
