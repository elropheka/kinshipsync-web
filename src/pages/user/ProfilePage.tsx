import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import ImageUploadInput from '@/components/common/ImageUploadInput';
import { deleteFileFromStorage } from '@/services/storageService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { showValidationErrors } from "@/lib/formValidationUtils";
import type { UpdateUserProfilePayload } from '@/types/userTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail } from 'lucide-react';

const profileFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required.").max(100),
  firstName: z.string().max(50).optional().or(z.literal('')),
  lastName: z.string().max(50).optional().or(z.literal('')),
  avatarUrl: z.string().url("Invalid URL for avatar.").optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

const sectionCardClass = 'rounded-xl border border-border bg-card shadow-sm';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    userProfile,
    isLoading: isLoadingProfile,
    isUpdating,
    error: profileError,
    fetchUserProfile,
    updateCurrentUserProfile
  } = useUserProfile();

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
          await deleteFileFromStorage(oldAvatarUrl);
        } catch (deleteError) {
          console.error("Failed to delete old avatar:", deleteError);
        }
      }
    } else {
      toast.error(getErrorMessage(profileError) || "Failed to update profile.");
    }
  };

  useErrorToast(profileError && !userProfile ? profileError : null, {
    title: 'Unable to load profile',
  });

  if (isLoadingProfile && !initialLoadComplete) {
    return (
      <div className="container mx-auto p-4 text-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (profileError && !userProfile) {
    return (
      <ErrorState
        error={profileError}
        title="Unable to load profile"
        onRetry={() => window.location.reload()}
        retryLabel="Reload Page"
        className="container mx-auto p-4 bg-background"
      />
    );
  }

  const displayLabel =
    userProfile?.displayName ||
    [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ') ||
    'Your profile';

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile summary card */}
        <Card className={`${sectionCardClass} overflow-hidden`}>
          <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/15 border-2 border-border flex items-center justify-center shrink-0">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{displayLabel}</h1>
                {userProfile?.email && (
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-primary" />
                    {userProfile.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Form sections */}
        <Card className={sectionCardClass}>
          <CardHeader>
            <CardTitle className="text-foreground">Personal information</CardTitle>
            <CardDescription>Update your display name and contact details.</CardDescription>
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
                        <FormLabel className="text-foreground">Display Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your display name"
                            className="rounded-xl border-border bg-background"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your first name"
                              className="rounded-xl border-border bg-background"
                              {...field}
                            />
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
                          <FormLabel className="text-foreground">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your last name"
                              className="rounded-xl border-border bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Profile photo</FormLabel>
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
                            imageClassName="h-24 w-24 object-cover rounded-full border-2 border-border"
                          />
                        </FormControl>
                        <FormDescription>Upload a profile picture for your account.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isUpdating || isLoadingProfile}
                    className="w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            ) : (
              <p className="text-muted-foreground">Loading profile information or profile not found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
