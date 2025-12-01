import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAllVendors } from '@/hooks/useAllVendors';
import { useAllUsers } from '@/hooks/useAllUsers';
import type { UserProfile } from '@/types/userTypes';
import type { CreateVendorProfilePayload } from '@/types/vendorTypes';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { showValidationErrors } from "@/lib/formValidationUtils";
// import { uploadFileToStorage } from '@/services/storageService'; // Will be handled by ImageUploadInput in step components

// Import step components
import VendorStep1Form from '@/components/vendor/VendorStep1Form';
import VendorStep2Form from '@/components/vendor/VendorStep2Form';
import VendorStep3Form from '@/components/vendor/VendorStep3Form';

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
  contactEmail: z.string().email("Invalid email address.").or(z.literal('')).optional(),
  phoneNumber: z.string().min(5, "Phone number seems too short.").max(30, "Phone number seems too long.").or(z.literal('')).optional(),
  websiteUrl: z.string().url("Invalid URL.").or(z.literal('')).optional(),
  address: addressSchema.optional(),
  logoUrl: z.string().url("Invalid URL for logo.").or(z.literal('')).optional(), // Will store the final URL
  // logoFile: z.custom<File>((val) => val instanceof File, "Please upload a valid image file for the logo.").optional(), // Removed
  servicesOffered: z.array(z.object({ value: z.string().min(1, "Service cannot be empty.") })).optional(),
  // portfolioFiles: z.array(z.custom<File>((val) => val instanceof File, "Please upload valid image files for the portfolio.")).optional(), // Removed
  pricingInfo: z.string().max(200).optional(),
  operatingHours: z.string().max(100).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export type VendorProfileFormData = z.infer<typeof profileFormSchema>;

const AdminRegisterVendorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { adminAddVendor, isLoading: isAddingVendor, error: addVendorError, vendors: allVendors, isLoading: isLoadingVendors } = useAllVendors();
  const { users, isLoading: isLoadingUsers, error: usersError, adminUpdateUserProfile } = useAllUsers();
  const [selectedUserId, setSelectedUserId] = useState('');

  const form = useForm<VendorProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      phoneNumber: '',
      websiteUrl: '',
      address: { street: '', city: '', state: '', postalCode: '', country: '' },
      logoUrl: '',
      servicesOffered: [],
      pricingInfo: '',
      operatingHours: '',
      categoryIds: [],
    },
  });

  const { handleSubmit: handleFormSubmit, reset, trigger, formState } = form; // Removed setError

  // Debug function to log form state
  const debugFormState = () => {
    console.log('=== FORM DEBUG INFO ===');
    console.log('Current form values:', form.getValues());
    console.log('Form errors:', formState.errors);
    console.log('Form is valid:', formState.isValid);
    console.log('Selected user ID:', selectedUserId);
    console.log('Current step:', currentStep);
    console.log('Is adding vendor:', isAddingVendor);
    console.log('========================');
  };

  const processAndSubmitData = async (formData: VendorProfileFormData) => {
    // Check for validation errors before proceeding
    if (!form.formState.isValid) {
      showValidationErrors(form.formState.errors, 'Please correct the form errors:');
      return;
    }

    console.log('[AdminRegisterVendorPage] processAndSubmitData called!');
    console.log('Selected User ID:', selectedUserId);
    console.log('Form Data:', formData);
    
    // Add debug info
    debugFormState();
    
    const data = formData as VendorProfileFormData;
    
    if (!selectedUserId || !selectedUserId.trim()) {
      console.log('ERROR: No user selected');
      toast.error("A user must be selected to register as a vendor.");
      return;
    }

    // Validate required fields manually
    if (!data.name || data.name.trim().length < 2) {
      console.log('ERROR: Name validation failed');
      toast.error("Vendor name is required and must be at least 2 characters.");
      return;
    }

    if (!data.description || data.description.trim().length < 10) {
      console.log('ERROR: Description validation failed');
      toast.error("Description is required and must be at least 10 characters.");
      return;
    }

    console.log('Basic validation passed, proceeding with submission...');

    // ImageUploadInput in step components will handle uploads and update data.logoUrl and data.portfolioImageUrls.
    const finalLogoUrl = data.logoUrl || ''; // Ensure it's a string
    
    const payload: CreateVendorProfilePayload = {
      // Spread data, but explicitly override image URLs and other processed fields
      name: data.name,
      description: data.description,
      contactEmail: data.contactEmail,
      phoneNumber: data.phoneNumber,
      websiteUrl: data.websiteUrl,
      pricingInfo: data.pricingInfo,
      operatingHours: data.operatingHours,
      // Non-file fields from data end
      name_lowercase: data.name.toLowerCase(),
      address: (data.address && Object.values(data.address).some(val => val && val.trim() !== '')) ? data.address : undefined,
      logoUrl: finalLogoUrl,
      servicesOffered: data.servicesOffered?.map(s => s.value).filter(s => s && s.trim()) || [],
      categoryIds: data.categoryIds || [],
    };
    // logoFile and portfolioFiles are no longer in VendorProfileFormData, so no need to delete from payload.

    console.log('Final payload:', payload);
    console.log('Calling adminAddVendor...');

    try {
      // Ensure payload matches CreateVendorProfilePayload, especially if it was derived from VendorProfileFormData
      // which no longer contains logoFile/portfolioFiles.
      const success = await adminAddVendor(payload, selectedUserId.trim());
      
      if (success) {
        console.log('Vendor registration successful! Attempting to update user role...');
        
        // Update user role to 'vendor'
        if (adminUpdateUserProfile) {
          // We don't need to find userToUpdate from the list for this,
          // as we're setting the role directly.
          const profileUpdatePayload: { role: "vendor"; isVendor: boolean } = {
            role: 'vendor', // Set the singular role with specific type
            isVendor: true,   // Keep isVendor consistent if it's still used
          };

          const userProfileUpdateSuccess = await adminUpdateUserProfile(selectedUserId.trim(), profileUpdatePayload);

          if (userProfileUpdateSuccess) {
            toast.success("Vendor profile registered and user role updated successfully!");
          } else {
            toast.warning("Vendor profile registered, but failed to update user role. Please update manually.");
          }
        } else {
          toast.warning("Vendor profile registered, but could not find user to update role or update function is unavailable. Please update manually.");
        }
        
        setSelectedUserId('');
        reset();
        setCurrentStep(1);
      } else {
        console.log('Vendor registration failed');
        toast.error(getErrorMessage(addVendorError) || "Failed to register vendor. Please try again.");
      }
    } catch (error) {
      console.error('Exception during vendor registration:', error);
      toast.error(getErrorMessage(error) || "An unexpected error occurred. Please try again.");
    }
  };

  const nextStep = async () => {
    console.log('nextStep called, current step:', currentStep);
    let fieldsToValidate: (keyof VendorProfileFormData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'description', 'categoryIds'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['contactEmail', 'phoneNumber', 'websiteUrl', 'address'];
    }

    console.log('Validating fields:', fieldsToValidate);
    const isValid = await trigger(fieldsToValidate);
    console.log('Validation result:', isValid);
    
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      console.log('Moving to next step');
    } else {
      console.log('Validation failed, showing errors');
      showValidationErrors(form.formState.errors, 'Please correct the errors before proceeding.');
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const filteredUsers = useMemo(() => {
    if (isLoadingUsers || isLoadingVendors || !users || !allVendors) {
      return [];
    }
    const existingVendorUserIds = new Set(allVendors.map(vendor => vendor.id));
    return users.filter(user => {
      const isNotVendor = !existingVendorUserIds.has(user.userId);
      const isNotAdmin = !user.isAdmin;
      return isNotVendor && isNotAdmin;
    });
  }, [users, allVendors, isLoadingUsers, isLoadingVendors]);

  // // Debug button handler
  // const handleDebugClick = () => {
  //   debugFormState();
  // };

  // Enhanced submit button handler with debugging
  const handleSubmitClick = (e: React.MouseEvent) => {
    console.log('Submit button clicked!');
    console.log('Event:', e);
    debugFormState();
    
    // Don't prevent default - let the form handle submission
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        {/* Debug Button */}
        {/* <Button 
          type="button" 
          onClick={handleDebugClick}
          variant="outline"
          className="mb-4"
        >
          Debug Form State
        </Button> */}

        {/* Link to Existing User Section */}
        <div className="mb-6 space-y-2">
          <Label htmlFor="selectedUserId">Select User to Register as Vendor</Label>
          {(isLoadingUsers || isLoadingVendors) && <p>Loading users and vendors...</p>}
          {usersError && (() => { toast.error(getErrorMessage(usersError)); return null; })()}
          {!isLoadingUsers && !isLoadingVendors && !usersError && (
            <Select
              value={selectedUserId}
              onValueChange={(value) => {
                console.log('User selected:', value);
                setSelectedUserId(value);
              }}
            >
              <SelectTrigger className="w-full dark:bg-gray-700">
                <SelectValue placeholder="Select a user to register" />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.length === 0 && (
                   <p className="p-2 text-sm text-muted-foreground">
                    {users && users.length > 0 ? "All existing users are already vendors." : "No users available to register as vendors."}
                  </p>
                )}
                {filteredUsers.map((user: UserProfile) => {
                  let userDisplay = '';
                  if (user.firstName && user.lastName) {
                    userDisplay = `${user.firstName} ${user.lastName}`;
                  } else if (user.firstName) {
                    userDisplay = user.firstName;
                  } else if (user.lastName) {
                    userDisplay = user.lastName;
                  } else {
                    userDisplay = user.displayName || user.email || `User ID: ${user.userId}`;
                  }

                  const showEmail = user.email && userDisplay !== user.email;
                  
                  return (
                    <SelectItem key={user.userId} value={user.userId}>
                      {userDisplay} {showEmail ? `(${user.email})` : ''}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
          <p className="text-sm text-muted-foreground">
            A vendor profile will be created and linked to the selected user.
          </p>
        </div>

        {/* Stepper UI */}
        <div className="mb-8 flex justify-center space-x-4">
          {[1, 2, 3].map(step => (
            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === step ? 'border-blue-500 bg-blue-500 text-white' : currentStep > step ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
              {step}
            </div>
          ))}
        </div>
        
        <Form {...form}>
          <form onSubmit={handleFormSubmit(processAndSubmitData)} className="space-y-8">
            {currentStep === 1 && <VendorStep1Form />} 
            {currentStep === 2 && <VendorStep2Form />}
            {currentStep === 3 && <VendorStep3Form />}

            <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {currentStep < 3 && (
              <Button type="button" onClick={nextStep} className="ml-auto" disabled={!selectedUserId.trim()}>
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button 
                type="submit" 
                disabled={isAddingVendor || !selectedUserId.trim()} 
                className="ml-auto"
                onClick={handleSubmitClick}
              >
                {isAddingVendor ? 'Registering Vendor...' : 'Register Vendor'}
              </Button>
            )}
            </div>
            {!selectedUserId.trim() && currentStep === 1 && (
              <p className="mt-4 text-sm text-yellow-600 text-center">Please select a user before proceeding.</p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminRegisterVendorPage;
