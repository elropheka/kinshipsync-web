import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';
import type { Event as EventType } from '../../types/eventTypes';
import { CalendarDays, Clock, MapPin, Users, DollarSign, Eye, Info, Globe, Mail } from 'lucide-react';
import EventDetailWebsite from '../../components/website/EventDetailWebsite';
import { useEventWebsite } from '../../hooks/useEventWebsite';
import { Button } from '../../components/ui/button'; // Assuming a shadcn/ui Button component
import InviteGuestsModal from '../../components/events/InviteGuestsModal'; // New component to create
import { useAuth } from '../../hooks/useAuth'; // Assuming an auth hook

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false); // State for modal
  const { websiteDetails, loading: websiteLoading, error: websiteError, updateWebsiteDetails } = useEventWebsite(eventId || '', 'id');
  const { user, isAuthenticated } = useAuth(); // Get auth state and user

  useEffect(() => {
    if (!eventId) {
      setError('Event ID is missing.');
      setLoading(false);
      return;
    }

    const fetchEventData = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventDocRef = doc(firestore, 'events', eventId);
        const eventDocSnap = await getDoc(eventDocRef);

        if (eventDocSnap.exists()) {
          const rawData = eventDocSnap.data();
          const eventData = rawData as Omit<EventType, 'id' | 'createdAt' | 'updatedAt' | 'date' | 'endDate'> & {
            createdAt?: Timestamp | string;
            updatedAt?: Timestamp | string;
            date?: Timestamp | string;
            endDate?: Timestamp | string; 
          };
          
          setEvent({
            id: eventDocSnap.id,
            name: eventData.name,
            description: eventData.description,
            date: eventData.date instanceof Timestamp ? eventData.date.toDate().toISOString().split('T')[0] : String(eventData.date || ''),
            time: eventData.time,
            endDate: eventData.endDate instanceof Timestamp ? eventData.endDate.toDate().toISOString().split('T')[0] : String(eventData.endDate || ''),
            endTime: eventData.endTime,
            location: eventData.location,
            organizerId: eventData.organizerId,
            visibility: eventData.visibility,
            allowedUserIds: eventData.allowedUserIds,
            overallBudget: eventData.overallBudget,
            totalAttendees: eventData.totalAttendees,
            status: eventData.status,
            createdAt: eventData.createdAt instanceof Timestamp ? eventData.createdAt.toDate().toISOString() : String(eventData.createdAt || ''),
            updatedAt: eventData.updatedAt instanceof Timestamp ? eventData.updatedAt.toDate().toISOString() : String(eventData.updatedAt || ''),
          });
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError('Failed to fetch event data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (loading) {
    return <div className="p-6 text-center">Loading event details...</div>;
  }

  if (error) {
    toast.error(getErrorMessage(error));
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Unable to load event details. Please try again.</p>
      </div>
    );
  }

  if (!event) {
    return <div className="p-6 text-center">No event data found.</div>;
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (_e) {
      console.log(_e);
      return dateString;
    }
  };
  
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    if (hours && minutes) {
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return timeString;
  };

  const handleWebsiteUpdate = async (updates: Parameters<typeof updateWebsiteDetails>[0]) => {
    await updateWebsiteDetails(updates);
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <div className="bg-background shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{event.name}</h1>
          <div className="flex items-center justify-between mb-4">
            {event.status && (
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                event.status === 'upcoming' ? 'bg-primary/10 text-primary' :
                event.status === 'ongoing' ? 'bg-primary/10 text-primary' :
                event.status === 'completed' ? 'bg-muted text-foreground' :
                event.status === 'cancelled' ? 'bg-destructive/10 text-destructive' : ''
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            )}
            {isAuthenticated && user?.userId === event.organizerId && (
              <Button onClick={() => setIsInviteModalOpen(true)} className="ml-4">
                <Mail className="w-4 h-4 mr-2" /> Invite Guests
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm text-foreground">
            <div className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-3 text-primary" />
              <span>
                {formatDate(event.date)}
                {event.endDate && event.endDate !== event.date && ` - ${formatDate(event.endDate)}`}
              </span>
            </div>
            {event.time && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-primary" />
                <span>
                  {formatTime(event.time)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center md:col-span-2">
                <MapPin className="w-5 h-5 mr-3 text-primary" />
                <span>{event.location}</span>
              </div>
            )}
            {typeof event.overallBudget === 'number' && (
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-3 text-primary" />
                <span>Budget: ${event.overallBudget.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-3 text-primary" />
              <span>Visibility: {event.visibility.charAt(0).toUpperCase() + event.visibility.slice(1)}</span>
            </div>
            {typeof event.totalAttendees === 'number' && (
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-primary" />
                <span>Attendees: {event.totalAttendees}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="mt-6 pt-6 border-t border-border">
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2" /> About this event
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Website Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center">
              <Globe className="w-5 h-5 mr-2" /> Event Website
            </h2>
            {websiteLoading ? (
              <div className="text-center py-4">Loading website details...</div>
            ) : websiteError ? (
              (() => { toast.error(getErrorMessage(websiteError)); return null; })() || (
                <div className="text-muted-foreground py-4 text-center">Unable to load website details.</div>
              )
            ) : (
              <EventDetailWebsite
                eventWebsite={websiteDetails}
                onUpdateEventWebsite={handleWebsiteUpdate}
              />
            )}
          </div>
        </div>
      </div>

      {event && isAuthenticated && user?.userId === event.organizerId && (
        <InviteGuestsModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          eventId={event.id}
          eventName={event.name}
          organizerName={user?.displayName || 'Organizer'} // Use user's display name
          eventDate={event.date}
          eventTime={event.time}
          eventLocation={event.location}
          currentUserId={user.userId}
        />
      )}
    </div>
  );
};

export default EventDetailPage;
