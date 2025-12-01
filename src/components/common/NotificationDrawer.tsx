import { useState, useEffect, forwardRef } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { Bell, X, CheckCircle } from 'lucide-react'; // Added CheckCircle icon
import type { InAppNotification } from '../../types/notificationTypes'; // Import InAppNotification type
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

type NotificationFilterType = 'all' | 'unread' | InAppNotification['type']; // Use InAppNotification['type']

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InAppNotification[]; // Notifications from useNotifications hook
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

// Use forwardRef to allow parent component to pass a ref to the main div
const NotificationDrawer = forwardRef<HTMLDivElement, NotificationDrawerProps>(
  ({ isOpen, onClose, notifications, markAsRead, markAllAsRead, loading, error }, ref) => {
    const [activeFilter, setActiveFilter] = useState<NotificationFilterType>('all');
    const [filteredNotifications, setFilteredNotifications] = useState<InAppNotification[]>([]);

    // Dynamically generate filter options based on available notification types
    const uniqueTypes = Array.from(new Set(notifications.map(n => n.type)));
    const filterOptions: { label: string; value: NotificationFilterType }[] = [
      { label: 'All', value: 'all' },
      { label: 'Unread', value: 'unread' },
      ...uniqueTypes.map(type => ({ label: type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), value: type as NotificationFilterType }))
    ];

    // Effect to apply filter when notifications or activeFilter changes
    useEffect(() => {
      let currentFiltered: InAppNotification[] = [];
      if (activeFilter === 'all') {
        currentFiltered = notifications;
      } else if (activeFilter === 'unread') {
        currentFiltered = notifications.filter(n => !n.isRead);
      } else {
        currentFiltered = notifications.filter(n => n.type === activeFilter);
      }
      setFilteredNotifications(currentFiltered);
    }, [notifications, activeFilter]);

    const handleNotificationClick = async (notification: InAppNotification) => {
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }
      // Optionally navigate based on notification.data.screen/itemId/url
      // e.g., if (notification.data?.screen) navigate(notification.data.screen);
      // onClose(); // Close drawer after clicking a notification
    };

    const formatNotificationTime = (timestamp: number): string => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    };

    return (
      <div
        ref={ref} // Attach the forwarded ref here
        className={`fixed top-0 right-0 h-full w-96 bg-background shadow-lg z-50 transform transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead} 
                disabled={loading || notifications.filter(n => !n.isRead).length === 0}
                title="Mark all as read"
              >
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
              <button 
                onClick={onClose} 
                                  className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"
                aria-label="Close notifications"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                  activeFilter === option.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-105px)]">
          {loading && <p className="p-4 text-center text-muted-foreground">Loading notifications...</p>}
          {error && (() => { toast.error(getErrorMessage(error)); return null; })()}
          {!loading && !error && filteredNotifications.length === 0 && (
            <p className="p-4 text-center text-muted-foreground">
              {activeFilter === 'all' || activeFilter === 'unread' ? 'No notifications found.' : `No ${activeFilter.replace(/_/g, ' ')} notifications.`}
            </p>
          )}
          {!loading && !error && filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border-b border-border ${!notification.isRead ? 'bg-primary/5' : ''} hover:bg-muted cursor-pointer`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start">
                {/* Avatar/Icon - Placeholder. You might want to map notification.type to specific icons or images */}
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                  <Bell size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-foreground">{notification.title}</span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full" title="Unread"></span>
                    )}
                  </div>
                  <p className="text-sm text-foreground mb-1">{notification.body}</p>
                  <p className="text-xs text-muted-foreground">{formatNotificationTime(notification.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default NotificationDrawer;
