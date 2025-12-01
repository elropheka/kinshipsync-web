import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showValidationErrors } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import type { UserProfile, AdminUpdateUserProfilePayload } from '@/types/userTypes';

const userEditFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required.").max(100),
  firstName: z.string().max(50).optional().or(z.literal('')),
  lastName: z.string().max(50).optional().or(z.literal('')),
  // Add other fields like roles, isAdmin, isVendor if needed for admin edit
});

export type UserEditFormData = z.infer<typeof userEditFormSchema>;

interface UserEditModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, data: AdminUpdateUserProfilePayload) => Promise<void>;
  isUpdating?: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, isOpen, onClose, onSubmit, isUpdating }) => {
  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      displayName: '',
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    } else {
      form.reset({
        displayName: '',
        firstName: '',
        lastName: '',
      });
    }
  }, [user, form, isOpen]); // Reset form when user or isOpen changes

  const handleFormSubmit = async (data: UserEditFormData) => {
    if (!user) return;

    const payload: AdminUpdateUserProfilePayload = {
      // We only send fields that are part of AdminUpdateUserProfilePayload
      // and are present in our form.
      displayName: data.displayName,
    };
    if (data.firstName || data.firstName === '') { // Allow clearing the field
        payload.firstName = data.firstName;
    }
    if (data.lastName || data.lastName === '') { // Allow clearing the field
        payload.lastName = data.lastName;
    }
    // If roles, isAdmin, isVendor were part of the form, they'd be added here.

    await onSubmit(user.userId, payload);
  };

  if (!isOpen || !user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className="w-full max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User: {user.displayName}</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit, (errors) => {
            showValidationErrors(errors, 'Please correct the form errors:');
          })} className="space-y-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="User's display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="User's first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="User's last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
