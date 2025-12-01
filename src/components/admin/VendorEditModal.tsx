import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showValidationErrors } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import type { Vendor, UpdateVendorProfilePayload } from '@/types/vendorTypes';

// Schema for the subset of fields editable by admin in this modal
const vendorEditFormSchema = z.object({
  name: z.string().min(1, "Vendor name is required.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(2000).optional().or(z.literal('')),
  // Add other fields like contactEmail, phoneNumber, etc., if admins should edit them
});

export type VendorEditFormData = z.infer<typeof vendorEditFormSchema>;

interface VendorEditModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vendorId: string, data: UpdateVendorProfilePayload) => Promise<void>;
  isUpdating?: boolean;
}

const VendorEditModal: React.FC<VendorEditModalProps> = ({ vendor, isOpen, onClose, onSubmit, isUpdating }) => {
  const form = useForm<VendorEditFormData>({
    resolver: zodResolver(vendorEditFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor.name || '',
        description: vendor.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [vendor, form, isOpen]);

  const handleFormSubmit = async (data: VendorEditFormData) => {
    if (!vendor) return;

    const payload: UpdateVendorProfilePayload = {
      name: data.name,
      description: data.description,
      // Only include fields that are part of UpdateVendorProfilePayload
      // and are being edited in this form.
    };

    await onSubmit(vendor.id, payload);
  };

  if (!isOpen || !vendor) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className="w-full max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Vendor: {vendor.name}</DialogTitle>
          <DialogDescription>
            Make changes to the vendor's profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit, (errors) => {
            showValidationErrors(errors, 'Please correct the form errors:');
          })} className="space-y-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vendor's business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Vendor's description" {...field} rows={3} />
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

export default VendorEditModal;
