import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from './firebaseConfig'; // Assuming this path is correct for web client
import type {
  Conversation, ChatMessage, ParticipantInfo, 
  CreateDirectConversationPayload, 
  SendMessagePayload
} from '../types/chatTypes';
import type { UserProfile } from '../types/userTypes'; // Assuming this path is correct for web client

// Placeholder for user service function - replace with actual implementation
// In a real app, this would fetch user profile from Firestore or a backend API
const getSenderProfileDetails = async (userId: string): Promise<Pick<UserProfile, 'displayName' | 'avatarUrl'>> => {
  if (!userId) {
    console.warn('getSenderProfileDetails: userId was not provided.');
    return { displayName: 'Unknown User', avatarUrl: undefined };
  }
  try {
    // This is a placeholder. You would typically fetch the user profile from Firestore.
    const userDocRef = doc(firestore, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserProfile;
      return { displayName: userData.displayName, avatarUrl: userData.avatarUrl || undefined };
    } else {
      console.warn(`getSenderProfileDetails: User profile not found for ${userId}, using defaults.`);
      return { displayName: 'Unknown User', avatarUrl: undefined };
    }
  } catch (error) {
    console.error(`Error fetching sender profile details for ${userId}:`, error);
    return { displayName: 'Unknown User', avatarUrl: undefined };
  }
};

export const sendMessage = async (isAuthenticated: boolean, payload: SendMessagePayload, senderId: string): Promise<ChatMessage> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!payload.conversationId) throw new Error("Conversation ID is required.");

  const conversationRef = doc(firestore, 'conversations', payload.conversationId);
  const messagesColRef = collection(conversationRef, 'messages');
  const senderDetails = await getSenderProfileDetails(senderId);

  const newMessageData = {
    conversationId: payload.conversationId,
    senderId,
    senderDisplayName: senderDetails.displayName,
    senderAvatarUrl: senderDetails.avatarUrl || null,
    content: payload.content,
    contentType: payload.contentType || 'text',
    mediaUrl: payload.mediaUrl || null,
    fileName: payload.fileName || null,
    fileSize: payload.fileSize || null,
    timestamp: serverTimestamp(),
    status: 'sent',
    reactions: [],
    ...(payload.contentType === 'eventInvitation' && {
      eventId: payload.eventId,
      guestId: payload.guestId,
      eventName: payload.eventName,
      rsvpStatus: payload.rsvpStatus || 'pending',
    }),
  };

  try {
    const messageDocRef = await addDoc(messagesColRef, newMessageData);
    await updateDoc(conversationRef, {
      lastMessage: {
        content: payload.content.substring(0, 100), // Use 'content' instead of 'text'
        timestamp: serverTimestamp(),
        senderId: senderId,
      },
      updatedAt: serverTimestamp(),
    });

    // In a web client, you might not send a separate in-app notification via a service
    // if the chat UI itself updates in real-time. However, if you want to mimic
    // the mobile's `sendNotification` for new messages, you'd call a web-specific
    // notification service here. For now, we'll omit it as the primary goal is chat.
    // If a notification service is implemented for web, it would be called here.

    return {
      id: messageDocRef.id,
      ...newMessageData,
      timestamp: new Date().toISOString(), // Convert server timestamp to ISO string for client
      mediaUrl: newMessageData.mediaUrl || undefined,
      fileName: newMessageData.fileName || undefined,
      fileSize: newMessageData.fileSize || undefined,
      reactions: newMessageData.reactions || [],
      eventId: newMessageData.eventId || undefined,
      guestId: newMessageData.guestId || undefined,
      eventName: newMessageData.eventName || undefined,
      rsvpStatus: newMessageData.rsvpStatus || (payload.contentType === 'eventInvitation' ? 'pending' : undefined),
    } as ChatMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const createDirectConversation = async (isAuthenticated: boolean, currentUserId: string, payload: CreateDirectConversationPayload): Promise<Conversation> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (currentUserId === payload.recipientId) throw new Error("Cannot create a direct conversation with oneself.");

  const sortedUserIds = [currentUserId, payload.recipientId].sort();
  const conversationId = sortedUserIds.join('_');
  const conversationRef = doc(firestore, 'conversations', conversationId);

  try {
    const docSnap = await getDoc(conversationRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || '',
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || '',
        lastMessage: data.lastMessage ? {
          content: data.lastMessage.content, // Use 'content'
          senderId: data.lastMessage.senderId,
          timestamp: (data.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || '',
        } : undefined,
       } as Conversation;
    }

    const currentUserDetails = await getSenderProfileDetails(currentUserId);
    const recipientUserDetails = await getSenderProfileDetails(payload.recipientId);
    const participants: ParticipantInfo[] = [
      { userId: currentUserId, displayName: currentUserDetails.displayName, avatarUrl: currentUserDetails.avatarUrl ?? null, role: 'member', lastReadTimestamp: new Date().toISOString() },
      { userId: payload.recipientId, displayName: recipientUserDetails.displayName, avatarUrl: recipientUserDetails.avatarUrl ?? null, role: 'member', lastReadTimestamp: new Date().toISOString() },
    ];
    const newConversationData = {
      type: 'direct',
      participantIds: [currentUserId, payload.recipientId],
      participants,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    };
    await setDoc(conversationRef, newConversationData);

    if (payload.initialMessage) {
      await sendMessage(isAuthenticated, { conversationId, content: payload.initialMessage }, currentUserId);
    }
    const finalDocSnap = await getDoc(conversationRef);
    if (!finalDocSnap.exists()) throw new Error("Failed to retrieve conversation after creation.");
    const finalData = finalDocSnap.data();
    return { 
      id: finalDocSnap.id,
      ...finalData,
      createdAt: (finalData.createdAt as Timestamp)?.toDate().toISOString() || '',
      updatedAt: (finalData.updatedAt as Timestamp)?.toDate().toISOString() || '',
      lastMessage: finalData.lastMessage ? {
        content: finalData.lastMessage.content, // Use 'content'
        senderId: finalData.lastMessage.senderId,
        timestamp: (finalData.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || '',
      } : null,
    } as Conversation;
  } catch (error) {
    console.error("Error creating direct conversation:", error);
    throw error;
  }
};

// Other chat functions (getConversations, listenToMessages, etc.) can be added as needed.
// For the purpose of event invitations, sendMessage and createDirectConversation are key.
