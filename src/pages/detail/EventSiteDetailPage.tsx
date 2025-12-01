import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { useEventWebsite } from '@/hooks/useEventWebsite';
import { EventSitePage } from '@/components/eventSite/EventSitePage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const EventSiteDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { event, websiteDetails, loading, error } = useEventWebsite(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event || !websiteDetails) {
    if (error) {
      toast.error(getErrorMessage(error));
    } else {
      toast.error('Event not found');
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground">
            The event you're looking for might have been removed or is not available.
          </p>
        </div>
      </div>
    );
  }

  // Check if the event is private and handle access control
  if (event.visibility === 'private') {
    // TODO: Implement private event access control
    // This could involve checking if the current user is in the allowedUserIds array
    // For now, we'll just show a message
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Private Event</h1>
          <p className="text-muted-foreground">
            This event is private. Please contact the organizer for access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <EventSitePage event={event} websiteDetails={websiteDetails} />
    </ErrorBoundary>
  );
};
