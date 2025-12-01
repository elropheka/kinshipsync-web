// Base Event Structure
export interface Event {
  id: string;
  name: string;
  name_lowercase?: string; // For case-insensitive search
  description?: string;
  date: string; // ISO 8601 date string (YYYY-MM-DD)
  time?: string; // e.g., "14:00" (HH:MM)
  endDate?: string; // Optional: ISO 8601 date string, for multi-day events
  endTime?: string; // Optional: for multi-day events
  location?: string; // Venue name or address string
  organizerId: string; // User ID of the organizer
  themeId?: string; // ID of the selected theme
  createdAt: string; // ISO 8601 date string, from Firestore Timestamp
  updatedAt: string; // ISO 8601 date string, from Firestore Timestamp
  overallBudget?: number;
  visibility: 'public' | 'private' | 'unlisted';
  allowedUserIds?: string[]; // For private event access
  totalAttendees?: number; // Calculated or manually set
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'; // Calculated or manually set by admin
  website?: WebsitePayload; // Website details
}

// Event Website Content
export interface EventWebsiteSection {
  id: string; // Unique ID for the section
  title: string;
  content: string;
  order: number; // To maintain section order
}

// Website payload type
export type WebsitePayload = {
  title?: string;
  customUrlSlug?: string;
  headerImageUrl?: string;
  welcomeMessage?: string;
  sections?: EventWebsiteSection[];
  websiteThemeId?: string;
  published: boolean;
};

// Payloads for creating and updating events
export interface CreateEventPayload {
  name: string;
  description?: string;
  date: string;
  time?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  overallBudget?: number;
  themeId?: string;
  visibility: Event['visibility'];
  allowedUserIds?: string[];
  website?: WebsitePayload;
}

// For updating, most fields are optional
export type UpdateEventPayload = Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'organizerId' | 'website'>> & {
  website?: WebsitePayload;
};

// Payload for updating event website details
export type UpdateEventWebsiteDetailsPayload = WebsitePayload;

export interface EventInvitationPayload {
  eventId: string;
  eventName: string;
  organizerName: string;
  recipientEmail?: string; // For email invitations
  recipientUserId?: string; // For in-app chat invitations
  customMessage?: string;
  eventDate: string; // ISO 8601 date string
  eventTime?: string; // e.g., "14:00" (HH:MM)
  eventLocation?: string;
}
