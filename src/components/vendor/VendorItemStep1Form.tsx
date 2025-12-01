import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CreateVendorItemPayload } from '@/types/vendorItemTypes';

const VendorItemStep1Form: React.FC = () => { // Removed VendorItemStep1FormProps
  const { control } = useFormContext<CreateVendorItemPayload>();

  return (
    <div className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Item/Service Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Wedding Photography Package, Gourmet Catering Service" {...field} />
            </FormControl>
            <FormDescription>
              A clear and concise name for your item or service.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Photography, Catering, Venue, Decor" {...field} />
            </FormControl>
            <FormDescription>
              The general category this item/service falls under.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide a detailed description of the item or service, what's included, etc."
                className="resize-none"
                {...field}
                rows={5}
              />
            </FormControl>
            <FormDescription>
              Describe your offering in detail to attract customers.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VendorItemStep1Form;
