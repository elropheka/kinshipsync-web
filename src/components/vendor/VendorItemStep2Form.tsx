import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // For availability
import type { CreateVendorItemPayload } from '@/types/vendorItemTypes';

// Define availability options
const AVAILABILITY_OPTIONS = [
  'Available',
  'Unavailable',
  'In Stock',
  'Out of Stock',
  'Custom Order',
  // Add more common options if needed, or allow free text
];

const VendorItemStep2Form: React.FC = () => {
  const { control } = useFormContext<CreateVendorItemPayload>();

  return (
    <div className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              {/* Ensuring field.value is string for Input, and converting onChange */}
              <Input 
                placeholder="e.g., 1500 or 'Contact for quote'" 
                {...field} 
                value={field.value === undefined || field.value === null ? '' : String(field.value)}
                onChange={e => {
                  const val = e.target.value;
                  // Attempt to parse as number if it looks like one, otherwise keep as string
                  field.onChange(isNaN(Number(val)) || val.trim() === '' ? val : Number(val));
                }}
              />
            </FormControl>
            <FormDescription>
              Enter a numeric price (e.g., 1500) or a text description (e.g., 'Per hour', 'Contact us').
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="availability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Availability</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {AVAILABILITY_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
                {/* Optionally, allow a custom free-text entry if not in predefined list, though Select doesn't directly support this.
                    If free text is critical, might need a ComboBox or Input with datalist.
                    For now, sticking to predefined options. */}
              </SelectContent>
            </Select>
            <FormDescription>
              Current availability status of the item/service.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Accra Only, Online, Ships Nationwide" {...field} />
            </FormControl>
            <FormDescription>
              Where this item/service is available or applicable.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL (Optional)</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
            <FormDescription>
              Link to an image representing this item or service.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VendorItemStep2Form;
