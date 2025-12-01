import React from 'react'; // Removed useState, useEffect as they are no longer needed for previews here
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageUploadInput from '@/components/common/ImageUploadInput'; // Added
import type { VendorProfileFormData } from '@/components/vendor/VendorProfileForm';

const VendorStep3Form: React.FC = () => {
  const { control, setValue, formState, setError } = useFormContext<VendorProfileFormData>(); // Removed watch
  
  const { fields: servicesFields, append: appendService, remove: removeService } = useFieldArray({
    control,
    name: "servicesOffered",
  });


  // Old preview logic removed, ImageUploadInput handles its own previews.

  return (
    <div className="space-y-8">
      {/* Logo Upload */}
      <FormField
        name="logoUrl" // Changed from logoFile
        control={control}
        render={({ field }) => (
          <FormItem>
            {/* FormLabel is part of ImageUploadInput */}
            <FormControl>
              <ImageUploadInput
                label="Vendor Logo"
                currentImageUrl={field.value}
                storagePath="vendorLogos"
                onImageUploaded={(newUrl) => {
                  setValue('logoUrl', newUrl, { shouldValidate: true, shouldDirty: true });
                }}
                onImageRemoved={() => {
                  setValue('logoUrl', '', { shouldValidate: true, shouldDirty: true });
                }}
                onError={(errorMessage) => {
                  setError('logoUrl', { type: 'manual', message: errorMessage });
                }}
                imageClassName="h-24 w-24 object-contain border rounded-md"
              />
            </FormControl>
            <FormDescription>Upload a logo for your business (e.g., PNG, JPG).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Services Offered */}
      <div>
        <FormLabel>Services Offered</FormLabel>
        <FormDescription>List the services you offer.</FormDescription>
        {servicesFields.map((item, index) => (
          <FormField
            key={item.id}
            control={control}
            name={`servicesOffered.${index}.value`}
            render={({ field: serviceField }) => (
              <FormItem className="flex items-center space-x-2 mt-2">
                <FormControl><Input placeholder="e.g., Wedding Photography" {...serviceField} /></FormControl>
                <Button type="button" variant="outline" size="sm" onClick={() => removeService(index)} disabled={servicesFields.length <= 1 && index === 0 && !serviceField.value}>Remove</Button>
              </FormItem>
            )}
          />
        ))}
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendService({ value: "" })}>
          Add Service
        </Button>
        <FormMessage>
            {formState.errors.servicesOffered?.message ||
            (Array.isArray(formState.errors.servicesOffered) &&
            (formState.errors.servicesOffered as unknown as { value?: { message?: string }}[]).some(e => e?.value?.message) ? // Cast to allow checking nested message
            "One or more services are invalid." : null)}
        </FormMessage>
      </div>

      {/* Pricing and Operating Hours */}
      <FormField
        name="pricingInfo"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pricing Information (Optional)</FormLabel>
            <FormControl><Input placeholder="e.g., Starts at $100, Packages available" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="operatingHours"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Operating Hours (Optional)</FormLabel>
            <FormControl><Input placeholder="e.g., Mon-Fri: 9am-5pm" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VendorStep3Form;
