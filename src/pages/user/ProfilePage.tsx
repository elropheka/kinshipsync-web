import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FiUser,
  FiBell,
  FiShield,
  FiGlobe,
  FiMoon,
  FiCamera,
  FiChevronRight,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ImageUploadInput from '@/components/common/ImageUploadInput';
import { deleteFileFromStorage } from '@/services/storageService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { ProfileFormSkeleton } from '@/components/common/skeletons';
import { showValidationErrors } from '@/lib/formValidationUtils';
import type { UpdateUserProfilePayload } from '@/types/userTypes';
import { DashboardCard, dashboardInputClass, dashboardSectionTitleClass } from '@/components/dashboard/DashboardCard';
import {
  profileNotificationSettings,
  profilePrivacyLinks,
  profilePreferenceFields,
} from '@/constants/mock/profileSettings';

const profileFormSchema = z
  .object({
    displayName: z.string().max(100).optional().or(z.literal('')),
    firstName: z.string().max(50).optional().or(z.literal('')),
    lastName: z.string().max(50).optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().max(30).optional().or(z.literal('')),
    location: z.string().max(100).optional().or(z.literal('')),
    avatarUrl: z.string().url().optional().or(z.literal('')),
    language: z.string().optional(),
    timezone: z.string().optional(),
    dateFormat: z.string().optional(),
  })
  .refine(
    (data) => Boolean(data.displayName?.trim() || data.firstName?.trim() || data.lastName?.trim()),
    { message: 'Provide a display name or at least a first or last name.', path: ['displayName'] }
  );

type ProfileFormData = z.infer<typeof profileFormSchema>;

const privacyIconMap = {
  shield: FiShield,
  globe: FiGlobe,
  user: FiUser,
} as const;

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    userProfile,
    isLoading: isLoadingProfile,
    isUpdating,
    error: profileError,
    fetchUserProfile,
    updateCurrentUserProfile,
  } = useUserProfile();

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      avatarUrl: '',
      language: '',
      timezone: '',
      dateFormat: '',
    },
  });

  useEffect(() => {
    const defaults = Object.fromEntries(
      profileNotificationSettings.map((s) => [s.key, s.defaultEnabled])
    );
    setNotifications(defaults);
  }, []);

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
        email: userProfile.email || currentUser?.email || '',
        phone: '',
        location: '',
        avatarUrl: userProfile.avatarUrl || '',
        language: 'English',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
      });
    }
  }, [userProfile, form, initialLoadComplete, currentUser?.email]);

  const handleAvatarUploaded = async (newUrl: string) => {
    form.setValue('avatarUrl', newUrl, { shouldValidate: true, shouldDirty: true });
    const oldAvatarUrl = userProfile?.avatarUrl;
    const success = await updateCurrentUserProfile({ avatarUrl: newUrl });
    if (success) {
      toast.success('Profile photo updated.');
      if (oldAvatarUrl && oldAvatarUrl !== newUrl) {
        try {
          await deleteFileFromStorage(oldAvatarUrl);
        } catch {
          /* ignore */
        }
      }
    } else {
      toast.error(getErrorMessage(profileError) || 'Failed to save profile photo.');
    }
  };

  const saveProfile = async (data: ProfileFormData) => {
    if (!currentUser) {
      toast.error('You must be logged in.');
      return;
    }

    const trimmedFirst = data.firstName?.trim() ?? '';
    const trimmedLast = data.lastName?.trim() ?? '';
    let displayName = data.displayName?.trim() ?? '';
    if (!displayName && (trimmedFirst || trimmedLast)) {
      displayName = [trimmedFirst, trimmedLast].filter(Boolean).join(' ');
    }

    const payload: UpdateUserProfilePayload = {
      displayName,
      firstName: trimmedFirst,
      lastName: trimmedLast,
      avatarUrl: data.avatarUrl,
    };

    const success = await updateCurrentUserProfile(payload);
    if (success) toast.success('Profile updated successfully.');
    else toast.error(getErrorMessage(profileError) || 'Failed to update profile.');
  };

  useErrorToast(profileError && !userProfile ? profileError : null, {
    title: 'Unable to load profile',
  });

  if (isLoadingProfile && !initialLoadComplete) return <ProfileFormSkeleton />;

  if (profileError && !userProfile) {
    return (
      <ErrorState
        error={profileError}
        title="Unable to load profile"
        onRetry={() => window.location.reload()}
        retryLabel="Reload Page"
      />
    );
  }

  const displayLabel =
    userProfile?.displayName ||
    [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ') ||
    'User';
  const avatarInitial = displayLabel.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto pb-10 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#5D2413] mb-1">Profile & Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </div>

      <DashboardCard className="p-6 md:p-8 text-center">
        <div className="relative inline-block mb-4">
          {form.watch('avatarUrl') ? (
            <img
              src={form.watch('avatarUrl')}
              alt={displayLabel}
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-secondary text-white text-3xl font-bold flex items-center justify-center mx-auto">
              {avatarInitial}
            </div>
          )}
          <Form {...form}>
            <div className="absolute bottom-0 right-0">
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <ImageUploadInput
                        label="profile-photo"
                        variant="avatar"
                        currentImageUrl={field.value}
                        storagePath="userAvatars"
                        onImageUploaded={(url) => void handleAvatarUploaded(url)}
                        onImageRemoved={() =>
                          form.setValue('avatarUrl', '', { shouldValidate: true, shouldDirty: true })
                        }
                        onError={(msg) => form.setError('avatarUrl', { type: 'manual', message: msg })}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
          <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center pointer-events-none">
            <FiCamera className="w-3.5 h-3.5" />
          </div>
        </div>
        <h2 className="font-bold text-[#5D2413] text-lg">{displayLabel}</h2>
        <p className="text-muted-foreground text-sm">{userProfile?.email || currentUser?.email}</p>

        <div className="mt-6 space-y-2 text-left">
          {[
            { label: 'Events Created', value: '12' },
            { label: 'Events Attended', value: '34' },
            { label: 'Member Since', value: '2024' },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F5EFE8]/60"
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="font-semibold text-[#5D2413]">{row.value}</span>
            </div>
          ))}
        </div>
      </DashboardCard>

      <Form {...form}>
        <div className="space-y-6">
          <DashboardCard className="p-6 md:p-8">
            <h2 className={`${dashboardSectionTitleClass} flex items-center gap-2 mb-6`}>
              <FiUser className="w-5 h-5" /> Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#5D2413]">First Name</FormLabel>
                      <FormControl>
                        <Input className={dashboardInputClass} {...field} />
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
                      <FormLabel className="text-[#5D2413]">Last Name</FormLabel>
                      <FormControl>
                        <Input className={dashboardInputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5D2413]">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" className={dashboardInputClass} {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5D2413]">Phone Number</FormLabel>
                    <FormControl>
                      <Input className={dashboardInputClass} placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5D2413]">Location</FormLabel>
                    <FormControl>
                      <Input className={dashboardInputClass} placeholder="San Francisco, CA" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                disabled={isUpdating}
                onClick={form.handleSubmit(saveProfile, (errors) =>
                  showValidationErrors(errors, 'Please correct the form errors:')
                )}
                className="rounded-xl bg-secondary hover:bg-secondary/90 text-white px-6"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DashboardCard>

      <DashboardCard className="p-6 md:p-8">
        <h2 className={`${dashboardSectionTitleClass} flex items-center gap-2 mb-6`}>
          <FiBell className="w-5 h-5" /> Notifications
        </h2>
        <div className="space-y-5">
          {profileNotificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-[#5D2413] text-sm">{setting.title}</p>
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications[setting.key]}
                onClick={() =>
                  setNotifications((prev) => ({ ...prev, [setting.key]: !prev[setting.key] }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications[setting.key] ? 'bg-primary' : 'bg-[#D6C8AF]'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    notifications[setting.key] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard className="p-6 md:p-8">
        <h2 className={`${dashboardSectionTitleClass} flex items-center gap-2 mb-4`}>
          <FiShield className="w-5 h-5" /> Privacy & Security
        </h2>
        <div className="divide-y divide-[#D6C8AF]/30">
          {profilePrivacyLinks.map((link) => {
            const Icon = privacyIconMap[link.icon];
            return (
              <a
                key={link.id}
                href={link.href}
                className="flex items-center justify-between py-4 text-[#5D2413] hover:text-secondary transition-colors"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Icon className="w-4 h-4" />
                  {link.title}
                </span>
                <FiChevronRight className="w-4 h-4 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardCard className="p-6 md:p-8">
        <h2 className={`${dashboardSectionTitleClass} flex items-center gap-2 mb-6`}>
          <FiMoon className="w-5 h-5" /> Preferences
        </h2>
        <div className="space-y-4">
          {profilePreferenceFields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.key}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-[#5D2413]">{field.label}</FormLabel>
                  <FormControl>
                    <Input className={dashboardInputClass} placeholder={field.placeholder} {...formField} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button
            type="button"
            onClick={form.handleSubmit(saveProfile)}
            className="rounded-xl bg-secondary hover:bg-secondary/90 text-white px-6"
          >
            Save Preferences
          </Button>
        </div>
      </DashboardCard>
        </div>
      </Form>
    </div>
  );
};

export default ProfilePage;
