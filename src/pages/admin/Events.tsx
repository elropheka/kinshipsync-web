import React, { useMemo, useState, useCallback } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { getAdminEventColumns } from './adminEventColumns';
import { useAllEvents } from '@/hooks/useAllEvents';
import { useAllUsers } from '@/hooks/useAllUsers';
import type { Event, CreateEventPayload, UpdateEventPayload, UpdateEventWebsiteDetailsPayload, WebsitePayload } from '@/types/eventTypes';
import type { UserProfile } from '@/types/userTypes';
import EventEditModal from '@/components/admin/EventEditModal';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { PageLoadingSkeleton } from '@/components/common/skeletons'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminEventsPage: React.FC = () => {
  const { groupedEvents, isLoading: isLoadingEvents, error: errorEvents, updateEvent, addEvent, getEventWebsiteDetails, deleteEvent, bulkDeleteEvents, fetchAllEvents } = useAllEvents();
  const { users, isLoading: isLoadingUsers, error: errorUsers } = useAllUsers();
  const navigate = useNavigate();

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  // TODO: Fetch and set eventWebsiteDetails when editingEvent is set for 'edit' mode.
  const [editingEventWebsiteDetails, setEditingEventWebsiteDetails] = useState<WebsitePayload | null>(null);
  const [isEventEditModalOpen, setIsEventEditModalOpen] = useState(false);
  const [isProcessingEvent, setIsProcessingEvent] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Delete operation states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [eventsToDelete, setEventsToDelete] = useState<Event[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);


  const userMap = useMemo(() => {
    if (!users) return {};
    return users.reduce((acc, user: UserProfile) => {
      let nameToDisplay = user.displayName;
      if (!nameToDisplay && (user.firstName || user.lastName)) {
        nameToDisplay = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      }
      // Fallback to userId if no name information is available at all
      acc[user.userId] = nameToDisplay || user.userId; 
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const handleEditEvent = useCallback(async (eventToEdit: Event) => {
    setEditingEvent(eventToEdit);
    setModalMode('edit');
    setIsEventEditModalOpen(true);
    // Fetch website details when opening the modal for an existing event
    if (eventToEdit && eventToEdit.id) {
      const details = await getEventWebsiteDetails(eventToEdit.id);
      setEditingEventWebsiteDetails(details);
    } else {
      setEditingEventWebsiteDetails(null);
    }
  }, [getEventWebsiteDetails]); // Added getEventWebsiteDetails to dependencies

  const handleViewEvent = useCallback((eventToView: Event) => {
    // This function can be used to view event details, e.g., redirect to a detailed view page
    // For now, we will just log the event to the console
    navigate(`/dashboard/events/${eventToView.id}`);
  }
  , [navigate]);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setEditingEventWebsiteDetails(null);
    setModalMode('create');
    setIsEventEditModalOpen(true);
  };

  const handleEventModalClose = () => {
    setIsEventEditModalOpen(false);
    setEditingEvent(null);
    setEditingEventWebsiteDetails(null);
  };

  // Delete handlers
  const handleDeleteEvent = useCallback((eventId: string) => {
    const event = Object.values(groupedEvents).flat().find(e => e.id === eventId);
    if (event) {
      setEventToDelete(event);
      setDeleteDialogOpen(true);
    }
  }, [groupedEvents]);

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    
    setIsDeleting(true);
    const success = await deleteEvent(eventToDelete.id);
    
    if (success) {
      toast.success("Event deleted successfully.");
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } else {
      toast.error("Failed to delete event.");
    }
    setIsDeleting(false);
  };

  const handleBulkDelete = useCallback((selectedEvents: Event[]) => {
    setEventsToDelete(selectedEvents);
    setBulkDeleteDialogOpen(true);
  }, []);

  const handleConfirmBulkDelete = async () => {
    if (eventsToDelete.length === 0) return;
    
    setIsDeleting(true);
    const eventIds = eventsToDelete.map(e => e.id);
    const result = await bulkDeleteEvents(eventIds);
    
    if (result.success > 0) {
      toast.success(`Successfully deleted ${result.success} event(s).`);
    }
    
    if (result.failed > 0) {
      toast.warning(`Failed to delete ${result.failed} event(s).`);
    }
    
    setBulkDeleteDialogOpen(false);
    setEventsToDelete([]);
    setIsDeleting(false);
  };

  // Updated to handle both event and website data
  const handleEventModalSubmit = async (
    eventData: CreateEventPayload | UpdateEventPayload,
    websiteData: UpdateEventWebsiteDetailsPayload | undefined,
    eventId?: string
  ) => {
    setIsProcessingEvent(true);
    let success = false;

    if (modalMode === 'create') {
      success = !!(await addEvent(eventData as CreateEventPayload, websiteData));
      if (success) toast.success("Event created successfully.");
    } else if (modalMode === 'edit' && eventId) {
      success = await updateEvent(eventId, eventData as UpdateEventPayload, websiteData);
      if (success) toast.success("Event updated successfully.");
    }

    if (success) {
      handleEventModalClose();
      fetchAllEvents(); // Refetch events to include the new/updated event
    } else {
      toast.error(`Failed to ${modalMode} event.`);
    }
    setIsProcessingEvent(false);
  };

  const columns = useMemo(() => {
    return getAdminEventColumns(userMap, handleEditEvent, handleViewEvent, handleDeleteEvent);
  }, [userMap, handleEditEvent, handleViewEvent, handleDeleteEvent]);

  useErrorToast(errorEvents, { title: 'Unable to load events' });
  useErrorToast(errorUsers, { title: 'Unable to load users' });

  if (isLoadingEvents || isLoadingUsers) {
    return <PageLoadingSkeleton className="p-4 md:p-6" />;
  }

  if (errorEvents) {
    return (
      <ErrorState
        error={errorEvents}
        title="Unable to load events"
        onRetry={() => window.location.reload()}
        retryLabel="Reload Page"
      />
    );
  }

  if (errorUsers) {
    return (
      <ErrorState
        error={errorUsers}
        title="Unable to load users"
        onRetry={() => window.location.reload()}
        retryLabel="Reload Page"
      />
    );
  }

  const eventCategories: Array<{ title: string; value: keyof typeof groupedEvents; data: Event[] }> = [
    { title: "Ongoing", value: "ongoing", data: groupedEvents.ongoing },
    { title: "Upcoming", value: "upcoming", data: groupedEvents.upcoming },
    { title: "Completed", value: "completed", data: groupedEvents.completed },
    { title: "Cancelled", value: "cancelled", data: groupedEvents.cancelled },
    { title: "Other", value: "other", data: groupedEvents.other },
  ];
  
  const totalEvents = Object.values(groupedEvents).reduce((sum, arr) => sum + arr.length, 0);
  const defaultTab = eventCategories.find(cat => cat.data.length > 0)?.value || "ongoing";

  // Bulk actions function
  const bulkActions = (selectedRows: Event[]) => (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => handleBulkDelete(selectedRows)}
      disabled={isDeleting}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Selected ({selectedRows.length})
    </Button>
  );

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <div className="flex justify-between items-center mb-8">
        {/* Page title is handled by MainLayout/Navbar */}
        <div /> {/* Empty div for spacing if title was here */}
        <Button onClick={handleOpenCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
        </Button>
      </div>

      {totalEvents === 0 && !isLoadingEvents && !isLoadingUsers ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No events found.</h2>
          <p className="text-gray-600 dark:text-gray-400">There are currently no events in the system.</p>
        </div>
      ) : (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-4">
            {eventCategories.map((category) => (
              category.data.length > 0 && (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.title} ({category.data.length})
                </TabsTrigger>
              )
            ))}
          </TabsList>
          {eventCategories.map((category) => (
            category.data.length > 0 && (
              <TabsContent key={category.value} value={category.value}>
                <DataTable
                  columns={columns}
                  data={category.data}
                  isLoading={isLoadingEvents || isLoadingUsers}
                  enableRowSelection={true}
                  globalFilterPlaceholder={`Search ${category.title.toLowerCase()}...`}
                  bulkActions={bulkActions}
                  renderMobileCard={(event: Event) => {
                    const status = event.status || (() => {
                      const now = new Date();
                      const start = new Date(event.date);
                      const end = event.endDate ? new Date(event.endDate) : start;
                      end.setHours(23, 59, 59, 999);
                      if (now > end) return 'completed';
                      if (now >= start && now <= end) return 'ongoing';
                      return 'upcoming';
                    })();
                    const badgeVariant = status === 'ongoing' ? 'bg-primary/10 text-primary' : status === 'completed' ? 'bg-muted text-muted-foreground' : status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-secondary/10 text-secondary';
                    const eventDate = new Date(event.date).toLocaleDateString();
                    const organizerName = userMap[event.organizerId] || event.organizerId;
                    return (
                      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-foreground text-sm leading-snug">{event.name}</p>
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${badgeVariant}`}>{status}</span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>{eventDate}{event.location ? ` · ${event.location}` : ''}</p>
                          <p>by {organizerName}</p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleViewEvent(event)}>View</Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleEditEvent(event)}>Edit</Button>
                          <Button variant="destructive" size="sm" className="h-8 text-xs ml-auto" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                        </div>
                      </div>
                    );
                  }}
                />
              </TabsContent>
            )
          ))}
        </Tabs>
      )}
      <EventEditModal
        event={editingEvent}
        eventWebsiteDetails={editingEventWebsiteDetails} // Pass website details for editing
        isOpen={isEventEditModalOpen}
        onClose={handleEventModalClose}
        onSubmit={handleEventModalSubmit} // Directly pass the updated handler
        isUpdating={isProcessingEvent}
        mode={modalMode}
      />
      
      {/* Individual Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{eventToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Events</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {eventsToDelete.length} event(s)? This action cannot be undone.
              <br />
              <br />
              Events to be deleted:
              <ul className="mt-2 list-disc list-inside">
                {eventsToDelete.map(event => (
                  <li key={event.id} className="text-sm">{event.name}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulkDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : `Delete ${eventsToDelete.length} Events`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEventsPage;
