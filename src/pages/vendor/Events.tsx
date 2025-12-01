import React, { useState } from 'react';
import { useUserVisibleEvents } from '@/hooks/useUserVisibleEvents';
import { useAllEvents } from '@/hooks/useAllEvents';
import type { Event, CreateEventPayload, UpdateEventPayload, UpdateEventWebsiteDetailsPayload, WebsitePayload } from '@/types/eventTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { PlusCircle, Edit3 } from 'lucide-react';
import EventCreateEditModal from '@/components/common/EventCreateEditModal';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  currentUserId?: string | null;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, currentUserId }) => {
  const isOrganizer = event.organizerId === currentUserId;
  return (
    <Card className="mb-4 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{event.name}</CardTitle>
            <CardDescription>
              {new Date(event.date).toLocaleDateString()}
              {event.location && ` - ${event.location}`}
            </CardDescription>
          </div>
          {isOrganizer && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(event)} title="Edit Event">
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{event.description || "No description available."}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant={
            event.status === 'ongoing' ? 'default' :
            event.status === 'completed' ? 'secondary' :
            event.status === 'upcoming' ? 'outline' :
            'destructive'
          } className="capitalize">
            {event.status}
          </Badge>
          <Badge variant="secondary" className="capitalize">{event.visibility}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <OrganizerDisplay organizerId={event.organizerId} />
      </CardFooter>
    </Card>
  );
};

const OrganizerDisplay: React.FC<{ organizerId: string }> = ({ organizerId }) => {
  const { userProfile, isLoading, error } = useUserProfile(organizerId);

  if (isLoading) return <p className="text-xs text-muted-foreground">Organized by: Loading...</p>;
  if (error) return <p className="text-xs text-muted-foreground">Organized by: {organizerId} (Error loading name)</p>;
  
  return (
    <p className="text-xs text-muted-foreground">
      Organized by: {userProfile?.displayName || organizerId}
    </p>
  );
};

const VendorEventsPage: React.FC = () => {
  const { groupedEvents: initialGroupedEvents, isLoading: isLoadingUserEvents, error: userEventsError, refetchEvents } = useUserVisibleEvents();
  const { currentUser } = useAuth();
  const { addEvent, updateEvent, getEventWebsiteDetails, isLoading: isProcessingEvent } = useAllEvents();

  const [searchTerm, setSearchTerm] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingEventWebsiteDetails, setEditingEventWebsiteDetails] = useState<WebsitePayload | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setEditingEventWebsiteDetails(null);
    setModalMode('create');
    setIsEventModalOpen(true);
  };

  const handleOpenEditModal = async (event: Event) => {
    setEditingEvent(event);
    if (event.id) {
      const websiteDetails = await getEventWebsiteDetails(event.id);
      setEditingEventWebsiteDetails(websiteDetails);
    }
    setModalMode('edit');
    setIsEventModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setEditingEventWebsiteDetails(null);
  };

  const handleModalSubmit = async (
    eventData: CreateEventPayload | UpdateEventPayload,
    websiteData: UpdateEventWebsiteDetailsPayload | undefined,
    eventId?: string
  ) => {
    let success = false;
    if (modalMode === 'create') {
      success = !!(await addEvent(eventData as CreateEventPayload, websiteData));
      if (success) toast.success("Event created successfully.");
    } else if (modalMode === 'edit' && eventId) {
      success = await updateEvent(eventId, eventData as UpdateEventPayload, websiteData);
      if (success) toast.success("Event updated successfully.");
    }

    if (success) {
      handleModalClose();
      refetchEvents();
    } else {
      toast.error("Failed to save event.");
    }
  };

  const filteredGroupedEvents = React.useMemo(() => {
    if (!searchTerm) return initialGroupedEvents;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filterFn = (event: Event) => 
      event.name.toLowerCase().includes(lowerSearchTerm) ||
      (event.description && event.description.toLowerCase().includes(lowerSearchTerm)) ||
      (event.location && event.location.toLowerCase().includes(lowerSearchTerm));
    
    return {
      ongoing: initialGroupedEvents.ongoing.filter(filterFn),
      upcoming: initialGroupedEvents.upcoming.filter(filterFn),
      completed: initialGroupedEvents.completed.filter(filterFn),
      other: initialGroupedEvents.other.filter(filterFn),
    };
  }, [searchTerm, initialGroupedEvents]);

  if (isLoadingUserEvents) return <div className="flex justify-center items-center h-full"><p>Loading events...</p></div>;

  if (userEventsError) {
    toast.error(getErrorMessage(userEventsError));
    return (
      <div className="flex flex-col justify-center items-center h-full p-4">
        <p className="text-muted-foreground mb-4">Unable to load events. Please try again.</p>
        <Button onClick={refetchEvents} className="mt-4">Try Again</Button>
      </div>
    );
  }
  
  const hasEventsAfterFilter = Object.values(filteredGroupedEvents).some(group => group.length > 0);
  const hasInitialEvents = Object.values(initialGroupedEvents).some(group => group.length > 0);

  const renderEventList = (events: Event[], statusName: string) => {
    if (events.length === 0) return <p className="text-muted-foreground mt-4">No {statusName.toLowerCase()} events {searchTerm ? 'matching your search' : ''}.</p>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {events.map(event => <EventCard key={event.id} event={event} onEdit={handleOpenEditModal} currentUserId={currentUser?.uid} />)}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-2">
          {hasInitialEvents && 
            <Input 
              type="search" 
              placeholder="Search your events..." 
              className="w-full sm:w-auto max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />}
          <Button onClick={handleOpenCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      </div>

      {hasInitialEvents ? (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
            {filteredGroupedEvents.ongoing.length > 0 && <TabsTrigger value="ongoing">Ongoing ({filteredGroupedEvents.ongoing.length})</TabsTrigger>}
            {filteredGroupedEvents.upcoming.length > 0 && <TabsTrigger value="upcoming">Upcoming ({filteredGroupedEvents.upcoming.length})</TabsTrigger>}
            {filteredGroupedEvents.completed.length > 0 && <TabsTrigger value="completed">Completed ({filteredGroupedEvents.completed.length})</TabsTrigger>}
            {filteredGroupedEvents.other.length > 0 && <TabsTrigger value="other">Other ({filteredGroupedEvents.other.length})</TabsTrigger>}
          </TabsList>
          {filteredGroupedEvents.ongoing.length > 0 && <TabsContent value="ongoing">{renderEventList(filteredGroupedEvents.ongoing, "Ongoing")}</TabsContent>}
          {filteredGroupedEvents.upcoming.length > 0 && <TabsContent value="upcoming">{renderEventList(filteredGroupedEvents.upcoming, "Upcoming")}</TabsContent>}
          {filteredGroupedEvents.completed.length > 0 && <TabsContent value="completed">{renderEventList(filteredGroupedEvents.completed, "Completed")}</TabsContent>}
          {filteredGroupedEvents.other.length > 0 && <TabsContent value="other">{renderEventList(filteredGroupedEvents.other, "Other")}</TabsContent>}
        </Tabs>
      ) : (
        !isLoadingUserEvents && 
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No Events Yet</h2>
          <p className="text-muted-foreground">Click "Create Event" to get started.</p>
        </div>
      )}
      {hasInitialEvents && !hasEventsAfterFilter && searchTerm && 
         <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">No Events Found</h2>
            <p className="text-muted-foreground">No events match your search term "{searchTerm}".</p>
          </div>}
      <EventCreateEditModal
        event={editingEvent}
        eventWebsiteDetails={editingEventWebsiteDetails}
        isOpen={isEventModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        isUpdating={isProcessingEvent}
        mode={modalMode}
      />
    </div>
  );
};

export default VendorEventsPage;
