import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'; // Added useEffect back
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showValidationErrors } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUploadInput from '@/components/common/ImageUploadInput'; // Added
import { deleteFileFromStorage } from '@/services/storageService'; // Added
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import type { Vendor, UpdateVendorProfilePayload } from '@/types/vendorTypes';
import { useVendorCategories } from '@/hooks/useVendorCategories';
// import { uploadFileToStorage } from '@/services/storageService'; // Removed as ImageUploadInput handles uploads
import { countries } from '@/lib/countries'; // Import countries list

// Zod schema for vendor profile form
const addressSchema = z.object({
  street: z.string().max(100).optional().or(z.literal('')),
  city: z.string().max(50).optional().or(z.literal('')),
  state: z.string().max(50).optional().or(z.literal('')),
  postalCode: z.string().max(20).optional().or(z.literal('')),
  country: z.string().max(50).optional().or(z.literal('')),
});

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(2000),
  contactEmail: z.string().email("Invalid email address.").optional().or(z.literal('')),
  // phoneNumber will store the full number including country code, e.g., +11234567890
  // The max length might need adjustment if very long country codes + numbers are expected.
  phoneNumber: z.string().min(5, "Phone number seems too short.").max(30, "Phone number seems too long.").optional().or(z.literal('')),
  websiteUrl: z.string().url("Invalid URL.").optional().or(z.literal('')),
  address: addressSchema.optional(),
  logoUrl: z.string().url("Invalid URL for logo.").optional().or(z.literal('')), // This will store the final URL
  // logoFile: z.custom<File>((val) => val instanceof File, "Please upload a valid image file for the logo.").optional(), // Removed
  servicesOffered: z.array(z.object({ value: z.string().min(1, "Service cannot be empty.") })).optional(),
  // portfolioFiles: z.array(z.custom<File>((val) => val instanceof File, "Please upload valid image files for the portfolio.")).optional(), // Removed
  pricingInfo: z.string().max(200).optional().or(z.literal('')),
  operatingHours: z.string().max(100).optional().or(z.literal('')),
  categoryIds: z.array(z.string()).optional(), // Removed .default([])
});

export type VendorProfileFormData = z.infer<typeof profileFormSchema>;

interface VendorProfileFormProps {
  onSubmit: (data: UpdateVendorProfilePayload) => Promise<void>;
  initialData?: Vendor | null;
  isLoading?: boolean;
}

export interface VendorProfileFormRef {
  reset: () => void;
}

const VendorProfileForm = forwardRef<VendorProfileFormRef, VendorProfileFormProps>(
  ({ onSubmit, initialData, isLoading }, ref) => {
    const { categories: availableCategories, isLoading: isLoadingCategories } = useVendorCategories();
    // const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null); // Removed
    // const [portfolioPreviews, setPortfolioPreviews] = useState<(string | null)[]>(initialData?.portfolioImageUrls || []); // Removed, ImageUploadInput handles previews
    
    // State for phone number parts
    // Try to parse initial phone number to prefill country code and national number
    const initialPhoneNumber = initialData?.phoneNumber || "";
    const foundCountry = countries.find(c => initialPhoneNumber.startsWith(c.callingCode));
    const initialSelectedCountryCode = foundCountry?.callingCode || "+1"; // Default to +1 (US/Canada)
    const initialNationalNumber = foundCountry 
      ? initialPhoneNumber.substring(foundCountry.callingCode.length)
      : initialPhoneNumber.startsWith("+") ? initialPhoneNumber.substring(1) : initialPhoneNumber; // Basic fallback

    const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = useState<string>(initialSelectedCountryCode);
    const [nationalPhoneNumber, setNationalPhoneNumber] = useState<string>(initialNationalNumber);


    const form = useForm<VendorProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      contactEmail: initialData?.contactEmail || '',
      phoneNumber: initialData?.phoneNumber || '',
      websiteUrl: initialData?.websiteUrl || '',
      address: {
        street: initialData?.address?.street || '',
        city: initialData?.address?.city || '',
        state: initialData?.address?.state || '',
        postalCode: initialData?.address?.postalCode || '',
        country: initialData?.address?.country || '',
      },
      logoUrl: initialData?.logoUrl || '',
      servicesOffered: initialData?.servicesOffered?.map(s => ({ value: s })) || [{ value: "" }],
      pricingInfo: initialData?.pricingInfo || '',
      operatingHours: initialData?.operatingHours || '',
      categoryIds: initialData?.categoryIds || [],
    },
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.reset({
        name: initialData?.name || '', // Or simply form.reset() to reset to initial defaultValues
        description: initialData?.description || '',
        contactEmail: initialData?.contactEmail || '',
        phoneNumber: initialData?.phoneNumber || '',
        websiteUrl: initialData?.websiteUrl || '',
        address: {
          street: initialData?.address?.street || '',
          city: initialData?.address?.city || '',
          state: initialData?.address?.state || '',
          postalCode: initialData?.address?.postalCode || '',
          country: initialData?.address?.country || '',
        },
        logoUrl: initialData?.logoUrl || '',
        servicesOffered: initialData?.servicesOffered?.map(s => ({ value: s })) || [{ value: "" }],
        pricingInfo: initialData?.pricingInfo || '',
        operatingHours: initialData?.operatingHours || '',
        categoryIds: initialData?.categoryIds || [],
      });
    }
  }), [form, initialData]);

  // Effect to revoke blob URLs for previews to prevent memory leaks
  useEffect(() => {
    // const allPreviews = [...portfolioPreviews].filter(p => p && p.startsWith('blob:')); // portfolioPreviews removed
    // No longer need to manage blob URLs here as ImageUploadInput handles its own previews.
    // If ImageUploadInput creates blob URLs, it should also revoke them.
    return () => {
      // any cleanup if needed, but previews are managed by individual ImageUploadInput instances
    };
  }, []);

  const { fields: servicesFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "servicesOffered",
  });



  const handleSubmit = async (data: VendorProfileFormData) => {
    const finalLogoUrl = data.logoUrl; 
    const oldLogoUrl = initialData?.logoUrl;

    // Filter out any empty strings from portfolioImageUrls that might exist if a slot was added but no image uploaded
    const processedData: UpdateVendorProfilePayload = {
      name: data.name,
      name_lowercase: data.name.toLowerCase(),
      description: data.description,
      contactEmail: data.contactEmail,
      phoneNumber: data.phoneNumber,
      websiteUrl: data.websiteUrl,
      address: (data.address && Object.values(data.address).some(val => val && val.trim() !== '')) ? data.address : undefined,
      logoUrl: finalLogoUrl,
      servicesOffered: data.servicesOffered?.map(s => s.value).filter(s => s && s.trim()) || [],
      pricingInfo: data.pricingInfo,
      operatingHours: data.operatingHours,
      categoryIds: data.categoryIds || [],
    };

    try {
      await onSubmit(processedData); // This saves to Firestore

      // After successful Firestore save, handle storage deletions
      if (oldLogoUrl && oldLogoUrl !== finalLogoUrl) {
        console.log(`Attempting to delete old vendor logo: ${oldLogoUrl}`);
        await deleteFileFromStorage(oldLogoUrl);
      }
      // No portfolio image deletion logic needed as the field is removed.
    } catch (error) {
      console.error("Error in form submission or old image deletion:", error);
      // form.setError("root", { message: "Submission failed." })
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
        showValidationErrors(errors, 'Please correct the form errors:');
      })} className="space-y-8">
        {/* Standard Fields: Name, Description, Contact, etc. */}
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Vendor Name</FormLabel><FormControl><Input placeholder="Your Business Name" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Tell us about your services" {...field} rows={5} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="contactEmail" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" placeholder="contact@example.com" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        {/* Phone Number Field with Country Code Selector */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => ( // `field` here is for the combined phoneNumber
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedPhoneCountryCode}
                  onValueChange={(newCountryCode) => {
                    setSelectedPhoneCountryCode(newCountryCode);
                    field.onChange(newCountryCode + nationalPhoneNumber);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.callingCode}>
                        {country.name} ({country.callingCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    value={nationalPhoneNumber}
                    onChange={(e) => {
                      const newNationalNumber = e.target.value.replace(/\D/g, ''); // Allow only digits
                      setNationalPhoneNumber(newNationalNumber);
                      field.onChange(selectedPhoneCountryCode + newNationalNumber);
                    }}
                    className="flex-1"
                  />
                </FormControl>
              </div>
              <FormDescription>
                Select country code and enter phone number. Flags are not displayed in this version.
              </FormDescription>
              <FormMessage /> {/* This will show validation messages for the combined phoneNumber field */}
            </FormItem>
          )}
        />
        <FormField name="websiteUrl" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Website URL (Optional)</FormLabel><FormControl><Input type="url" placeholder="https://yourwebsite.com" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        {/* Vendor Logo using ImageUploadInput */}
        <FormField
          control={form.control}
          name="logoUrl" // This field now directly stores the URL
          render={({ field }) => (
            <FormItem>
              {/* FormLabel is part of ImageUploadInput */}
              <FormControl>
                <ImageUploadInput
                  label="Vendor Logo"
                  currentImageUrl={field.value}
                  storagePath="vendorLogos"
                  onImageUploaded={(newUrl) => {
                    form.setValue('logoUrl', newUrl, { shouldValidate: true, shouldDirty: true });
                  }}
                  onImageRemoved={() => {
                    // When removing, we set the logoUrl to empty string.
                    // The old image will be deleted from storage on submit if initialData.logoUrl existed.
                    form.setValue('logoUrl', '', { shouldValidate: true, shouldDirty: true });
                  }}
                  onError={(errorMessage) => {
                    form.setError('logoUrl', { type: 'manual', message: errorMessage });
                  }}
                  imageClassName="h-24 w-24 object-contain border rounded-md" // Style for logo preview
                />
              </FormControl>
              <FormDescription>Upload a logo for your business (e.g., PNG, JPG).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Removed hidden input for logoUrl and old logoFile input field */}

        {/* Address Fields */}
        <h3 className="text-lg font-medium border-b pb-2">Address</h3>
        <FormField name="address.street" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Street</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="address.city" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        {/* ... other address fields: state, postalCode, country ... */}
         <FormField name="address.state" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>State/Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="address.postalCode" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} placeholder="e.g. 90210" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField
          control={form.control}
          name="address.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Category Selection */}
        <div>
          <FormLabel>Vendor Categories</FormLabel>
          <FormDescription>Select the categories your services fall into.</FormDescription>
          {isLoadingCategories ? <p>Loading categories...</p> : availableCategories.length === 0 ? <p>No categories available.</p> : (
            <FormField
              control={form.control}
              name="categoryIds"
              render={() => (
                <FormItem className="space-y-2 mt-2">
                  {availableCategories.map((category) => (
                    <FormField
                      key={category.id}
                      control={form.control}
                      name="categoryIds"
                      render={({ field }) => {
                        return (
                          <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), category.id])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== category.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {category.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Services Offered */}
        <h3 className="text-lg font-medium border-b pb-2">Service Details</h3>
        <div>
          <FormLabel>Services Offered</FormLabel>
          <FormDescription>List the services you offer.</FormDescription>
          {servicesFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
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
            {form.formState.errors.servicesOffered?.message || 
             (Array.isArray(form.formState.errors.servicesOffered) && 
              (form.formState.errors.servicesOffered as { value?: { message?: string }}[]).some(e => e?.value?.message) ? 
              "One or more services are invalid." : null)}
          </FormMessage>
        </div>

        <FormField name="pricingInfo" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Pricing Information (Optional)</FormLabel><FormControl><Input placeholder="e.g., Starts at $100, Packages available" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="operatingHours" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Operating Hours (Optional)</FormLabel><FormControl><Input placeholder="e.g., Mon-Fri: 9am-5pm" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Saving Profile...' : 'Save Profile'}
        </Button>
      </form>
    </Form>
  );
});

export default VendorProfileForm;
