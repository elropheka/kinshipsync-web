import React, { useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'; // Assuming shadcn/ui dialog components
import { Button } from '../ui/button'; // Assuming shadcn/ui button
import { Input } from '../ui/input'; // Assuming shadcn/ui input
import { Label } from '../ui/label'; // Assuming shadcn/ui label
import { Textarea } from '../ui/textarea'; // Assuming shadcn/ui textarea
import { sendEventInvitation } from '../../services/invitationService'; // Import the invitation service
import type { EventInvitationPayload } from '../../types/eventTypes'; // Import the payload type

interface InviteGuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
  organizerName: string;
  eventDate: string;
  eventTime?: string;
  eventLocation?: string;
  currentUserId: string;
}

const InviteGuestsModal: React.FC<InviteGuestsModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventName,
  organizerName,
  eventDate,
  eventTime,
  eventLocation,
  currentUserId,
}) => {
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [recipientUserId, setRecipientUserId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!recipientEmail && !recipientUserId) {
      toast.error('Please provide either a recipient email or a recipient user ID.');
      setLoading(false);
      return;
    }

    const payload: EventInvitationPayload = {
      eventId,
      eventName,
      organizerName,
      eventDate,
      eventTime,
      eventLocation,
      customMessage,
      recipientEmail: recipientEmail || undefined,
      recipientUserId: recipientUserId || undefined,
    };

    try {
      const { emailSent, chatMessageSent } = await sendEventInvitation(true, currentUserId, payload); // isAuthenticated is true here as modal only shows for authenticated users

      let message = 'Invitation sent successfully!';
      if (emailSent && chatMessageSent) {
        message = 'Invitation sent via email and in-app chat.';
      } else if (emailSent) {
        message = 'Invitation sent via email.';
      } else if (chatMessageSent) {
        message = 'Invitation sent via in-app chat.';
      } else {
        message = 'Failed to send invitation.';
        toast.error(message);
      }
      toast.success(message);
      setSuccessMessage(message);
      // Clear form after successful send
      setRecipientEmail('');
      setRecipientUserId('');
      setCustomMessage('');
    } catch (error) {
      console.error('Error sending event invitation:', error);
      toast.error(getErrorMessage(error) || 'Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Guests to {eventName}</DialogTitle>
          <DialogDescription>
            Send an invitation to your event via email or in-app chat.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
            <Label htmlFor="recipientEmail" className="text-right">
              Recipient Email
            </Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="col-span-3"
              placeholder="guest@example.com"
            />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipientUserId" className="text-right">
              Recipient User ID
            </Label>
            <Input
              id="recipientUserId"
              value={recipientUserId}
              onChange={(e) => setRecipientUserId(e.target.value)}
              className="col-span-3"
              placeholder="Firebase User ID (optional)"
            />
          </div> */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
            <Label htmlFor="customMessage" className="text-right">
              Custom Message
            </Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="col-span-3"
              placeholder="Looking forward to seeing you!"
            />
          </div>
          {loading && <p className="text-center text-blue-500">Sending invitation...</p>}
          {successMessage && <p className="text-center text-green-500">{successMessage}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteGuestsModal;
