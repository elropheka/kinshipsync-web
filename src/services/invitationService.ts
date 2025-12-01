import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig'; // Assuming firebaseConfig exports 'app'
import type { EventInvitationPayload } from '../types/eventTypes';
import { createDirectConversation, sendMessage } from './chatService'; // Import chat service functions

/**
 * Sends an event invitation via email and/or in-app chat message.
 */
export const sendEventInvitation = async (
  isAuthenticated: boolean,
  currentUserId: string,
  payload: EventInvitationPayload
): Promise<{ emailSent: boolean; chatMessageSent: boolean }> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }

  const functionsInstance = getFunctions(app);
  const callableSendEmail = httpsCallable(functionsInstance, 'sendEmail');

  let emailSent = false;
  let chatMessageSent = false;

  // 1. Send Email Invitation (if recipientEmail is provided)
  if (payload.recipientEmail) {
    try {
      const emailSubject = `You're invited to ${payload.eventName} by ${payload.organizerName}!`;
      const emailHtmlContent = `
     <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Invitation</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: hsl(var(--muted));
                    line-height: 1.6;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: hsl(var(--card));
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                
                .header {
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
                    padding: 30px 40px;
                    text-align: center;
                    color: hsl(var(--primary-foreground));
                }
                
                .logo {
                    max-width: 120px;
                    height: auto;
                    margin-bottom: 15px;
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                
                .content {
                    padding: 40px;
                }
                
                .greeting {
                    font-size: 18px;
                    color: hsl(var(--foreground));
                    margin-bottom: 20px;
                }
                
                .invitation-text {
                    font-size: 16px;
                    color: hsl(var(--muted-foreground));
                    margin-bottom: 30px;
                }
                
                .event-details {
                    background-color: hsl(var(--muted));
                    border-left: 4px solid hsl(var(--primary));
                    padding: 25px;
                    margin: 25px 0;
                    border-radius: 8px;
                }
                
                .event-name {
                    font-size: 24px;
                    font-weight: 700;
                    color: hsl(var(--primary));
                    margin-bottom: 20px;
                    text-align: center;
                }
                
                .detail-row {
                    display: flex;
                    margin-bottom: 12px;
                    align-items: flex-start;
                }
                
                .detail-label {
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    min-width: 80px;
                    margin-right: 15px;
                }
                
                .detail-value {
                    color: hsl(var(--muted-foreground));
                    flex: 1;
                }
                
                .custom-message {
                    background-color: hsl(var(--card));
                    border: 2px solid hsl(var(--border));
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                    font-style: italic;
                }
                
                .custom-message-label {
                    font-weight: 600;
                    color: hsl(var(--primary));
                    margin-bottom: 10px;
                    font-style: normal;
                }
                
                .rsvp-section {
                    text-align: center;
                    margin: 35px 0;
                }
                
                .rsvp-text {
                    font-size: 16px;
                    color: hsl(var(--muted-foreground));
                    margin-bottom: 20px;
                }
                
                .rsvp-button {
                    display: inline-block;
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
                    color: hsl(var(--primary-foreground));
                    text-decoration: none;
                    padding: 15px 35px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px hsl(var(--primary) / 0.3);
                }
                
                .rsvp-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px hsl(var(--primary) / 0.4);
                }
                
                .footer-message {
                    font-size: 16px;
                    color: hsl(var(--muted-foreground));
                    text-align: center;
                    margin: 25px 0;
                }
                
                .signature {
                    border-top: 2px solid hsl(var(--border));
                    padding-top: 25px;
                    text-align: center;
                    color: hsl(var(--muted-foreground));
                }
                
                .signature .company-name {
                    color: hsl(var(--primary));
                    font-weight: 600;
                }
                
                            @media (max-width: 600px) {
                    body {
                        padding: 10px;
                    }
                    
                    .header {
                        padding: 20px;
                    }
                    
                    .logo {
                        max-width: 100px;
                    }
                    
                    .header h1 {
                        font-size: 24px;
                    }
                    
                    .content {
                        padding: 25px;
                    }
                    
                    .event-name {
                        font-size: 20px;
                    }
                    
                    .detail-row {
                        flex-direction: column;
                    }
                    
                    .detail-label {
                        margin-bottom: 5px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="https://kinshipsync.com/logo.png" alt="KinshipSync Logo" class="logo">
                    <h1>You're Invited!</h1>
                </div>
                
                <div class="content">
                    <p class="greeting">Hi there!</p>
                    
                    <p class="invitation-text">
                        You've been invited by <strong>${payload.organizerName}</strong> to join an exciting event!
                    </p>
                    
                    <div class="event-details">
                        <div class="event-name">${payload.eventName}</div>
                        
                        <div class="detail-row">
                            <span class="detail-label">📅 Date:</span>
                            <span class="detail-value">${payload.eventDate} ${payload.eventTime ? `at ${payload.eventTime}` : ''}</span>
                        </div>
                        
                        ${payload.eventLocation ? `
                        <div class="detail-row">
                            <span class="detail-label">📍 Location:</span>
                            <span class="detail-value">${payload.eventLocation}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${payload.customMessage ? `
                    <div class="custom-message">
                        <div class="custom-message-label">💬 Message from ${payload.organizerName}:</div>
                        <div>${payload.customMessage}</div>
                    </div>
                    ` : ''}
                    
                    <div class="rsvp-section">
                        <p class="rsvp-text">Please let us know if you can attend!</p>
                        <a href="[EVENT_RSVP_LINK_PLACEHOLDER]" class="rsvp-button">
                            RSVP to ${payload.eventName}
                        </a>
                    </div>
                    
                    <p class="footer-message">We look forward to seeing you there! 🎉</p>
                    
                    <div class="signature">
                        <p>Best regards,<br>
                        The <span class="company-name">KinshipSync</span> Team</p>
                    </div>
                </div>
            </div>
        </body>
        </html>`;

      const result = await callableSendEmail({
        toEmail: payload.recipientEmail,
        toName: payload.recipientEmail, // Or fetch recipient's name if available
        subject: emailSubject,
        htmlContent: emailHtmlContent,
        fromName: 'KinshipSync', // Use organizer's name as sender name
      });

      const responseData = result.data as { success: boolean; message: string };
      if (responseData.success) {
        console.log(`Email invitation successfully sent to ${payload.recipientEmail}`);
        emailSent = true;
      } else {
        console.error(`Failed to send email invitation to ${payload.recipientEmail}:`, responseData.message);
      }
    } catch (error) {
      console.error('Error sending email invitation:', error);
    }
  }

  // 2. Send In-App Chat Message (if recipientUserId is provided)
  if (payload.recipientUserId) {
    try {
      // Ensure a direct conversation exists or create one
      const conversation = await createDirectConversation(isAuthenticated, currentUserId, {
        recipientId: payload.recipientUserId,
      });

      if (conversation?.id) {
        const chatMessageContent = payload.customMessage || `You're invited to ${payload.eventName}!`;
        await sendMessage(isAuthenticated, {
          conversationId: conversation.id,
          content: chatMessageContent,
          contentType: 'eventInvitation',
          eventId: payload.eventId,
          eventName: payload.eventName,
          // guestId: 'TODO: If there's a specific guest record ID, add it here',
          rsvpStatus: 'pending',
        }, currentUserId);
        console.log(`Chat message invitation successfully sent to user ${payload.recipientUserId}`);
        chatMessageSent = true;
      } else {
        console.error(`Failed to get/create conversation for user ${payload.recipientUserId}.`);
      }
    } catch (error) {
      console.error('Error sending chat message invitation:', error);
    }
  }

  return { emailSent, chatMessageSent };
};
