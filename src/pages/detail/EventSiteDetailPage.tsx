import { useParams } from 'react-router-dom';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useEventWebsite } from '@/hooks/useEventWebsite';
import { EventSitePage } from '@/components/eventSite/EventSitePage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { PageLoadingSkeleton } from '@/components/common/skeletons';

export const EventSiteDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { event, websiteDetails, loading, error } = useEventWebsite(slug);

  useErrorToast(error, { title: 'Unable to load event' });

  if (loading) {
    return <PageLoadingSkeleton className="min-h-screen" />;
  }

  if (error || !event || !websiteDetails) {
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

  if (!websiteDetails.published) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Website Not Published</h1>
          <p className="text-muted-foreground">
            This event website is not available yet. Please contact the organizer for access.
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
