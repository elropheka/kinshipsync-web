import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'; // Added FormDescription
import ImageUploadInput from '@/components/common/ImageUploadInput'; // Added
import { deleteFileFromStorage } from '@/services/storageService'; // Added
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { showValidationErrors } from "@/lib/formValidationUtils";
import type { UpdateUserProfilePayload } from '@/types/userTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required.").max(100),
  firstName: z.string().max(50).optional().or(z.literal('')),
  lastName: z.string().max(50).optional().or(z.literal('')),
  avatarUrl: z.string().url("Invalid URL for avatar.").optional().or(z.literal('')),
  // Add other editable fields here: bio, phoneNumber, address etc.
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    userProfile, 
    isLoading: isLoadingProfile, 
    isUpdating, 
    error: profileError, 
    fetchUserProfile, 
    updateCurrentUserProfile 
  } = useUserProfile(); // Uses currentUser.uid by default from useUserProfile hook

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
      firstName: '',
      lastName: '',
      avatarUrl: '',
    },
  });

  useEffect(() => {
    if (currentUser?.uid && !initialLoadComplete) {
      fetchUserProfile().then(() => setInitialLoadComplete(true));
    }
  }, [currentUser, fetchUserProfile, initialLoadComplete]);

  useEffect(() => {
    if (userProfile && initialLoadComplete) {
      form.reset({
        displayName: userProfile.displayName || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        avatarUrl: userProfile.avatarUrl || '',
      });
    }
  }, [userProfile, form, initialLoadComplete]);

  const handleFormSubmit = async (data: ProfileFormData) => {
    // Check for validation errors before proceeding
    if (!form.formState.isValid) {
      showValidationErrors(form.formState.errors, 'Please correct the form errors:');
      return;
    }

    if (!currentUser) {
      toast.error("You must be logged in.");
      return;
    }

    const oldAvatarUrl = userProfile?.avatarUrl;

    const payload: UpdateUserProfilePayload = {
      displayName: data.displayName,
      firstName: data.firstName,
      lastName: data.lastName,
      avatarUrl: data.avatarUrl, 
    };

    const success = await updateCurrentUserProfile(payload);
    if (success) {
      toast.success("Profile updated successfully.");
      if (oldAvatarUrl && oldAvatarUrl !== data.avatarUrl) {
        try {
          console.log(`Attempting to delete old avatar: ${oldAvatarUrl}`);
          await deleteFileFromStorage(oldAvatarUrl);
        } catch (deleteError) {
          console.error("Failed to delete old avatar:", deleteError);
        }
      }
    } else {
      toast.error(getErrorMessage(profileError) || "Failed to update profile.");
    }
  };
  
  if (isLoadingProfile && !initialLoadComplete) {
    return <div className="container mx-auto p-4 text-center">Loading profile...</div>;
  }

  if (profileError && !userProfile) {
    toast.error(getErrorMessage(profileError));
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-muted-foreground mb-4">Unable to load profile. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }
  
  // if (!userProfile && initialLoadComplete) {
  //   return <div className="container mx-auto p-4 text-center">Profile data not available. It might be a new user.</div>;
  // }


  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          {userProfile ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit, (errors) => {
                showValidationErrors(errors, 'Please correct the form errors:');
              })} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Avatar Upload Field */}
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploadInput
                          label="Avatar"
                          currentImageUrl={field.value}
                          storagePath="userAvatars"
                          onImageUploaded={(newUrl) => {
                            form.setValue('avatarUrl', newUrl, { shouldValidate: true, shouldDirty: true });
                          }}
                          onImageRemoved={() => {
                            form.setValue('avatarUrl', '', { shouldValidate: true, shouldDirty: true });
                          }}
                          onError={(errorMessage) => {
                            form.setError('avatarUrl', { type: 'manual', message: errorMessage });
                          }}
                          imageClassName="h-24 w-24 object-cover rounded-full border" // Circular preview for avatar
                        />
                      </FormControl>
                      <FormDescription>Upload a profile picture.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Add more fields here as needed, e.g., bio */}
                <Button type="submit" disabled={isUpdating || isLoadingProfile} className="w-full">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          ) : (
             <p>Loading profile information or profile not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
