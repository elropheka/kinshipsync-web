import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showValidationErrors } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUploadInput from '@/components/common/ImageUploadInput'; // Added
import { deleteFileFromStorage } from '@/services/storageService'; // Added
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added Select components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { VendorItem } from '@/types/vendorItemTypes';
import { useVendorCategories } from '@/hooks/useVendorCategories'; // Added hook for categories

// Validation schema
const itemFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000),
  price: z.union([
    z.number().positive({ message: "Price must be a positive number." }),
    z.string().regex(/^\d+(\.\d{1,2})?$|^Contact for quote$|^Negotiable$|^Custom Price$/, { message: "Invalid price format or value." })
  ]),
  category: z.string().min(2, { message: "Category is required." }).max(50),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  availability: z.string().optional(), // Could be more specific with z.enum if options are fixed
  location: z.string().min(2, { message: "Location is required." }).max(100),
});

export type VendorItemFormData = z.infer<typeof itemFormSchema>;

interface VendorItemFormProps {
  onSubmit: (data: VendorItemFormData, itemId?: string) => Promise<void>;
  initialData?: VendorItem | null; // For editing
  isLoading?: boolean;
}

const VendorItemForm: React.FC<VendorItemFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const { categories, isLoading: isLoadingCategories } = useVendorCategories(); // Fetch categories

  const form = useForm<VendorItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || '', // Ensure price is handled correctly if it can be string or number
      category: initialData?.category || '',
      imageUrl: initialData?.imageUrl || '',
      availability: initialData?.availability || '',
      location: initialData?.location || '',
    },
  });

  const handleSubmit = async (data: VendorItemFormData) => {
    const oldImageUrl = initialData?.imageUrl;
    try {
      await onSubmit(data, initialData?.id); // This saves to Firestore

      // After successful Firestore save, handle storage deletion
      if (oldImageUrl && oldImageUrl !== data.imageUrl) {
        // If image was replaced or removed
        console.log(`Attempting to delete old item image: ${oldImageUrl}`);
        await deleteFileFromStorage(oldImageUrl);
      }
    } catch (error) {
      console.error("Error in form submission or old image deletion:", error);
      // Optionally, re-throw or display error to user
      // form.setError("root", { message: "Submission failed." }) // Example of setting form error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
        showValidationErrors(errors, 'Please correct the form errors:');
      })} className="space-y-6 container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item/Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Deluxe Wedding Package" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the item or service..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (USD or text like "Contact for quote")</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1500 or Contact for quote" {...field} 
                 onChange={e => field.onChange(isNaN(parseFloat(e.target.value)) ? e.target.value : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}> {/* Assuming we store category ID */}
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Accra, Online" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Input placeholder="e.g., In Stock, Custom Order" {...field} />
              </FormControl>
              <FormDescription>
                Common options: In Stock, Out of Stock, Custom Order, Available, Unavailable. Or type your own.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Item Image</FormLabel> */} {/* Label is inside ImageUploadInput */}
              <FormControl>
                <ImageUploadInput
                  label="Item Image"
                  currentImageUrl={field.value}
                  storagePath="vendorItemImages"
                  onImageUploaded={(newUrl) => {
                    form.setValue('imageUrl', newUrl, { shouldValidate: true, shouldDirty: true });
                  }}
                  onImageRemoved={() => {
                    form.setValue('imageUrl', '', { shouldValidate: true, shouldDirty: true });
                  }}
                  onError={(errorMessage) => {
                    form.setError('imageUrl', { type: 'manual', message: errorMessage });
                  }}
                  imageClassName="w-40 h-40 object-cover rounded-md border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || form.formState.isSubmitting} className="w-full">
          {isLoading || form.formState.isSubmitting
            ? (initialData ? 'Saving Changes...' : 'Adding Item...')
            : (initialData ? 'Save Changes' : 'Add Item')}
        </Button>
      </form>
    </Form>
  );
};

export default VendorItemForm;
