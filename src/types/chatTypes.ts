// import { Timestamp } from "firebase/firestore";

export type ConversationType = 'direct' | 'group';
export type MessageContentType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'eventInvitation';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type ParticipantRole = 'member' | 'admin';
export type RSVPStatus = 'pending' | 'accepted' | 'declined';

export interface ParticipantInfo {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: ParticipantRole;
  lastReadTimestamp: string; // ISO 8601 string
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // For group chats
  participantIds: string[]; // Array of user IDs for easy querying
  participants: ParticipantInfo[]; // Detailed participant info
  creatorId?: string; // For group chats
  avatarUrl?: string | null; // For group chats
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: string; // ISO 8601 string
  } | null;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface MessageReaction {
  userId: string;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderDisplayName: string;
  senderAvatarUrl?: string | null;
  content: string;
  contentType: MessageContentType;
  mediaUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  timestamp: string; // ISO 8601 string
  status: MessageStatus;
  reactions: MessageReaction[];
  editedAt?: string; // ISO 8601 string

  // Specific to event invitations
  eventId?: string;
  guestId?: string; // The ID of the invited guest (if applicable)
  eventName?: string;
  rsvpStatus?: RSVPStatus;
}

// Payloads for creating conversations and sending messages
export interface CreateDirectConversationPayload {
  recipientId: string;
  initialMessage?: string;
}

export interface CreateGroupConversationPayload {
  name: string;
  participantIds: string[]; // User IDs to include in the group (excluding current user, who is added automatically)
  initialMessage?: string;
  avatarUrl?: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  contentType?: MessageContentType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  // For event invitations
  eventId?: string;
  guestId?: string;
  eventName?: string;
  rsvpStatus?: RSVPStatus;
}

export interface GetMessagesParams {
  conversationId: string;
  limit?: number;
  startAfter?: ChatMessage;
}

export interface MarkConversationAsReadPayload {
  conversationId: string;
}
