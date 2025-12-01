import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { showValidationErrors } from "@/lib/formValidationUtils";
import { useVendorCategories } from '@/hooks/useVendorCategories'; // To list parent categories and add new one
import type { VendorCategory } from '@/types/vendorTypes';

// Simplified Zod schema for the modal form
const newCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters.").max(100),
  parentCategoryId: z.string().optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
});

type NewCategoryFormData = z.infer<typeof newCategorySchema>;

interface AddNewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (newCategory: VendorCategory) => void; // Callback after successful addition
}

const AddNewCategoryModal: React.FC<AddNewCategoryModalProps> = ({ isOpen, onClose, onCategoryAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories: availableParentCategories, isLoading: isLoadingParentCategories, addCategory } = useVendorCategories();

  const form = useForm<NewCategoryFormData>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: '',
      parentCategoryId: '_NONE_',
      description: '',
    },
  });

  const { handleSubmit, control, reset } = form;

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const onSubmit = async (data: NewCategoryFormData) => {
    setIsSubmitting(true);
    try {
      const slug = generateSlug(data.name);
      const payload = {
        name: data.name,
        slug,
        parentCategoryId: data.parentCategoryId === '_NONE_' ? undefined : data.parentCategoryId,
        description: data.description || undefined,
        // iconUrl will be undefined as we are not handling icon uploads in this modal
      };

      const newCategory = await addCategory(payload); // Assuming addCategory returns the created category or its ID

      if (newCategory) {
        toast.success("New category added successfully!");
        onCategoryAdded(newCategory); // Pass the new category back
        reset();
        onClose();
      } else {
        // This case might occur if addCategory returns null/undefined on failure before throwing an error
        throw new Error("Failed to create category, addCategory returned no result.");
      }
    } catch (error) {
      console.error("Error adding new category:", error);
      toast.error(getErrorMessage(error) || "Could not add category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog is closed or opened
  React.useEffect(() => {
    if (isOpen) {
      reset({ name: '', parentCategoryId: '_NONE_', description: '' });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Vendor Category</DialogTitle>
          <DialogDescription>
            Quickly add a new category. You can add more details like an icon later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit, (errors) => {
            showValidationErrors(errors, 'Please correct the form errors:');
          })} className="space-y-4 py-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Event Planners" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || '_NONE_'}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingParentCategories}>
                        <SelectValue placeholder={isLoadingParentCategories ? "Loading..." : "Select parent"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="_NONE_">None (Top-level category)</SelectItem>
                      {availableParentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of this category." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCategoryModal;
