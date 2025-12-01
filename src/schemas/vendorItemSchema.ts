import { z } from 'zod';

// Schema for Step 1: Core Item Details
export const vendorItemStep1Schema = z.object({
  name: z.string().min(3, { message: "Item name must be at least 3 characters long." }).max(100, { message: "Item name must be 100 characters or less." }),
  category: z.string().min(2, { message: "Category must be at least 2 characters long." }).max(50, { message: "Category must be 50 characters or less." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }).max(1000, { message: "Description must be 1000 characters or less." }),
});

// Schema for Step 2: Pricing & Logistics
export const vendorItemStep2Schema = z.object({
  price: z.union([
    z.number().positive({ message: "Price must be a positive number." }),
    z.string().min(1, { message: "Price description cannot be empty." })
  ]).refine(value => (typeof value === 'number' && value > 0) || (typeof value === 'string' && value.trim().length > 0), {
    message: "Price must be a positive number or a non-empty string.",
  }),
  availability: z.string().optional(), // Making it optional as it's a Select
  location: z.string().max(100, { message: "Location must be 100 characters or less." }).optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')), // Allow empty string or valid URL
});

// Combined schema for the entire form (CreateVendorItemPayload)
// This will be useful for the final submission
export const vendorItemSchema = vendorItemStep1Schema.merge(vendorItemStep2Schema);

// Type inferred from the combined schema
export type VendorItemFormData = z.infer<typeof vendorItemSchema>;

// Helper to get schema for current step
export const getVendorItemSchemaForStep = (step: number) => {
  if (step === 1) return vendorItemStep1Schema;
  if (step === 2) return vendorItemStep2Schema;
  return vendorItemSchema; // Default to full schema or handle error
};
