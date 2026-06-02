import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showValidationErrors } from '@/lib/formValidationUtils';
import { ProfileDisplayNameResolver } from '@/lib/profileDisplayName';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const userRoles = ['organizer', 'admin', 'vendor', 'member'] as const;

const userEditFormSchema = z
  .object({
    displayName: z.string().max(100).optional().or(z.literal('')),
    firstName: z.string().max(50).optional().or(z.literal('')),
    lastName: z.string().max(50).optional().or(z.literal('')),
    role: z.enum(userRoles),
  })
  .refine(
    (data) =>
      Boolean(
        data.displayName?.trim() || data.firstName?.trim() || data.lastName?.trim()
      ),
    {
      message: 'Provide a display name or at least a first or last name.',
      path: ['displayName'],
    }
  );

export type UserEditFormData = z.infer<typeof userEditFormSchema>;

interface UserEditModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, data: AdminUpdateUserProfilePayload) => Promise<void>;
  isUpdating?: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  isUpdating,
}) => {
  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      displayName: '',
      firstName: '',
      lastName: '',
      role: 'organizer',
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        displayName: user.displayName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'organizer',
      });
    }
  }, [user, form, isOpen]);

  const handleFormSubmit = async (data: UserEditFormData) => {
    if (!user) return;

    const trimmedFirst = data.firstName?.trim() ?? '';
    const trimmedLast = data.lastName?.trim() ?? '';
    let displayName = data.displayName?.trim() ?? '';

    if (!displayName && (trimmedFirst || trimmedLast)) {
      displayName = [trimmedFirst, trimmedLast].filter(Boolean).join(' ');
    }

    const payload: AdminUpdateUserProfilePayload = {
      displayName,
      firstName: trimmedFirst,
      lastName: trimmedLast,
      role: data.role,
      isAdmin: data.role === 'admin',
      isVendor: data.role === 'vendor',
    };

    await onSubmit(user.userId, payload);
  };

  if (!isOpen || !user) {
    return null;
  }

  const userLabel = ProfileDisplayNameResolver.fromProfile(user, user.email);

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className="w-full max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update profile details for {userLabel}. Email cannot be changed here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, (errors) => {
              showValidationErrors(errors, 'Please correct the form errors:');
            })}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
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
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input placeholder="Shown across the app" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="sm:col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={user.email} disabled readOnly className="bg-muted" />
                </FormControl>
              </FormItem>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role} value={role} className="capitalize">
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
