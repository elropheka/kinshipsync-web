import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useVendorProfile } from '@/hooks/useVendorProfile';
// Vendor type is not directly used, UpdateVendorProfilePayload is sufficient for submit.
import type { UpdateVendorProfilePayload } from '@/types/vendorTypes'; 
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { showValidationErrors } from "@/lib/formValidationUtils";
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { uploadFileToStorage, deleteFileFromStorage } from '@/services/storageService';

// Import step components
import VendorStep1Form from '@/components/vendor/VendorStep1Form';
import VendorStep2Form from '@/components/vendor/VendorStep2Form';
import VendorStep3Form from '@/components/vendor/VendorStep3Form';

// Zod schema for vendor profile form (consistent with AdminRegisterVendorPage)
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
  phoneNumber: z.string().min(5, "Phone number seems too short.").max(30, "Phone number seems too long.").optional().or(z.literal('')),
  websiteUrl: z.string().url("Invalid URL.").optional().or(z.literal('')),
  address: addressSchema.optional(),
  logoUrl: z.string().url("Invalid URL for logo.").optional().or(z.literal('')), // For existing/uploaded URL
  logoFile: z.custom<File>((val) => val instanceof File, "Please upload a valid image file for the logo.").optional(),
  servicesOffered: z.array(z.object({ value: z.string().min(1, "Service cannot be empty.") })).optional(),
  pricingInfo: z.string().max(200).optional().or(z.literal('')),
  operatingHours: z.string().max(100).optional().or(z.literal('')),
  categoryIds: z.array(z.string()).optional(),
});

export type VendorProfileFormData = z.infer<typeof profileFormSchema>;

const VendorProfilePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { profile, isLoading: isLoadingProfile, isUpdating, error: profileError, updateProfile } = useVendorProfile();

  const form = useForm<VendorProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { // Initial empty defaults, will be overridden by profile data
      name: '',
      description: '',
      contactEmail: '',
      phoneNumber: '',
      websiteUrl: '',
      address: { street: '', city: '', state: '', postalCode: '', country: '' },
      logoUrl: '',
      servicesOffered: [{ value: "" }],
      pricingInfo: '',
      operatingHours: '',
      categoryIds: [],
    },
  });

  const { handleSubmit: handleFormSubmit, reset, trigger, setError } = form; // Removed watch

  // Populate form with profile data once loaded
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        description: profile.description || '',
        contactEmail: profile.contactEmail || '',
        phoneNumber: profile.phoneNumber || '',
        websiteUrl: profile.websiteUrl || '',
        address: profile.address || { street: '', city: '', state: '', postalCode: '', country: '' },
        logoUrl: profile.logoUrl || '',
        servicesOffered: profile.servicesOffered?.map(s => ({ value: s })) || [{ value: "" }],
        pricingInfo: profile.pricingInfo || '',
        operatingHours: profile.operatingHours || '',
        categoryIds: profile.categoryIds || [],
      });
    }
  }, [profile, reset]);

  const processAndSubmitData = async (data: VendorProfileFormData) => {
    let finalLogoUrl = data.logoUrl || profile?.logoUrl || ''; // Prioritize new data, then existing profile, then empty

    // Handle Logo Upload
    if (data.logoFile) {
      try {
        const newUrl = await uploadFileToStorage(data.logoFile, `vendorLogos/${profile?.id || 'unknown_vendor'}`);
        if (finalLogoUrl && finalLogoUrl !== newUrl) { // If there was an old logo, mark it for deletion
          // Consider deleting only if the entire profile update is successful later
          // For now, let's assume immediate deletion is okay or handled by re-upload logic
          try {
            await deleteFileFromStorage(finalLogoUrl);
          } catch (deleteErr) {
            console.warn("Old logo deletion failed during new logo upload:", deleteErr);
            // Non-critical, proceed with new logo URL
          }
        }
        finalLogoUrl = newUrl;
      } catch (uploadError) {
        console.error("Logo upload failed:", uploadError);
        setError("logoFile", { type: "manual", message: "Logo upload failed. Please try again." });
        toast.error("Logo upload failed. Please check the file and try again.");
        setCurrentStep(3); // Go back to step with logo upload
        return;
      }
    }

    const payload: UpdateVendorProfilePayload = {
      name: data.name,
      description: data.description,
      contactEmail: data.contactEmail,
      phoneNumber: data.phoneNumber,
      websiteUrl: data.websiteUrl,
      address: (data.address && Object.values(data.address).some(val => val && val.trim() !== '')) ? data.address : undefined,
      logoUrl: finalLogoUrl || undefined, // Ensure it's undefined if empty string
      servicesOffered: data.servicesOffered?.map(s => s.value).filter(s => s && s.trim()) || [],
      pricingInfo: data.pricingInfo,
      operatingHours: data.operatingHours,
      categoryIds: data.categoryIds || [],
    };
    
    console.log('Submitting to updateProfile. Payload:', payload, 'Current profileError state:', profileError); // DEBUG
    const success = await updateProfile(payload);
    console.log('Update success response:', success, 'Profile error state after update call:', profileError); // DEBUG
    
    if (success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(getErrorMessage(profileError) || "Failed to update profile. Please try again.");
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof VendorProfileFormData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'description', 'categoryIds'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['contactEmail', 'phoneNumber', 'websiteUrl', 'address'];
    }
    // Step 3 validation happens on final submit.

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      showValidationErrors(form.formState.errors, 'Please correct the errors before proceeding.');
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  if (isLoadingProfile && !profile) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  // If profile is explicitly null after loading and no error, it implies vendor profile doesn't exist.
  // This page is for *managing* an existing profile. If it doesn't exist,
  // the vendor should be guided to a creation flow or this page shouldn't be accessible.
  // For now, we assume `useVendorProfile` hook handles this (e.g. vendor user must have a profile).
  // If `profile` is `null` but `updateProfile` can create, the form will act as a create form.
  // The `useVendorProfile` hook's `updateProfile` should handle create-if-not-exists logic.

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      {/* <h1 className="text-3xl font-bold mb-8">Manage Your Vendor Profile</h1> Page title moved to Navbar */}
      
              <div className="max-w-2xl mx-auto bg-background p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        {/* Stepper UI */}
        <div className="mb-8 flex justify-center space-x-4">
          {[1, 2, 3].map(step => (
            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === step ? 'border-primary bg-primary text-primary-foreground' : currentStep > step ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
              {step}
            </div>
          ))}
        </div>
        
        <Form {...form}>
          <form onSubmit={handleFormSubmit(processAndSubmitData, (errors) => {
            showValidationErrors(errors, 'Please correct the form errors:');
          })} className="space-y-8">
            {/* Step components will get data from react-hook-form context */}
            {currentStep === 1 && <VendorStep1Form />} 
            {currentStep === 2 && <VendorStep2Form />}
            {currentStep === 3 && <VendorStep3Form />}

            <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isUpdating}>
                Previous
              </Button>
            )}
            {currentStep < 3 && (
              <Button type="button" onClick={nextStep} className="ml-auto" disabled={isUpdating}>
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button type="submit" disabled={isUpdating} className="ml-auto">
                {isUpdating ? 'Saving Profile...' : 'Save Profile'}
              </Button>
            )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VendorProfilePage;
