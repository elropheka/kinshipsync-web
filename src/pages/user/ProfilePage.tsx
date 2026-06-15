import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FiUser,
  FiBell,
  FiShield,
  FiMoon,
  FiChevronRight,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ThemeSwitch } from '@/components/ui/switch';
import ImageUploadInput from '@/components/common/ImageUploadInput';
import { deleteFileFromStorage } from '@/services/storageService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useUserVisibleEvents } from '@/hooks/useUserVisibleEvents';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { ProfileFormSkeleton } from '@/components/common/skeletons';
import { showValidationErrors } from '@/lib/formValidationUtils';
import type { UpdateUserProfilePayload } from '@/types/userTypes';
import { DashboardCard, dashboardInputClass, dashboardSectionTitleClass } from '@/components/dashboard/DashboardCard';

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
  })
  .refine(
    (data) => Boolean(data.displayName?.trim() || data.firstName?.trim() || data.lastName?.trim()),
    { message: 'Provide a display name or at least a first or last name.', path: ['displayName'] }
  );

type ProfileFormData = z.infer<typeof profileFormSchema>;

type EmailNotificationKey = 'eventInvites' | 'eventUpdates' | 'messageAlerts' | 'newsletter';
type PushNotificationKey = 'eventInvites' | 'eventUpdates' | 'messageAlerts' | 'taskAlerts';

const emailNotificationOptions: { key: EmailNotificationKey; title: string; description: string }[] = [
  { key: 'eventInvites', title: 'Event Invites', description: 'Get notified when you receive event invitations' },
  { key: 'eventUpdates', title: 'Event Updates', description: 'Changes to events you are part of' },
  { key: 'messageAlerts', title: 'Message Alerts', description: 'New messages and replies' },
  { key: 'newsletter', title: 'Newsletter', description: 'Product updates and tips from Kinship Sync' },
];

const pushNotificationOptions: { key: PushNotificationKey; title: string; description: string }[] = [
  { key: 'eventInvites', title: 'Event Invites', description: 'Push alerts for new invitations' },
  { key: 'eventUpdates', title: 'Event Updates', description: 'Push alerts when event details change' },
  { key: 'messageAlerts', title: 'Message Alerts', description: 'Push alerts for new messages' },
  { key: 'taskAlerts', title: 'Task Alerts', description: 'Reminders for assigned tasks' },
];

const formatMemberSince = (createdAt?: string) => {
  if (!createdAt) return '—';
  return new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

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
  const { settings, isUpdating: isUpdatingSettings, updateSettings } = useUserSettings();
  const { groupedEvents } = useUserVisibleEvents();

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

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
    },
  });

  useEffect(() => {
    if (currentUser?.uid && !initialLoadComplete) {
      fetchUserProfile().then(() => setInitialLoadComplete(true));
    }
  }, [currentUser, fetchUserProfile, initialLoadComplete]);

  useEffect(() => {
    if (userProfile && initialLoadComplete) {
      const city = userProfile.address?.city;
      const state = userProfile.address?.state;
      const location = [city, state].filter(Boolean).join(', ');

      form.reset({
        displayName: userProfile.displayName || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || currentUser?.email || '',
        phone: userProfile.phoneNumber || '',
        location,
        avatarUrl: userProfile.avatarUrl || '',
        language: settings?.language || 'en',
      });
    }
  }, [userProfile, form, initialLoadComplete, currentUser?.email, settings?.language]);

  const profileStats = useMemo(() => {
    const uid = currentUser?.uid;
    if (!uid) {
      return { eventsCreated: 0, eventsAttended: 0, memberSince: '—' };
    }

    const allEvents = [
      ...(groupedEvents.upcoming || []),
      ...(groupedEvents.ongoing || []),
      ...(groupedEvents.completed || []),
      ...(groupedEvents.other || []),
    ];

    const uniqueEvents = Array.from(new Map(allEvents.map((e) => [e.id, e])).values());
    const eventsCreated = uniqueEvents.filter((e) => e.organizerId === uid).length;
    const eventsAttended = uniqueEvents.filter(
      (e) => e.organizerId !== uid && e.allowedUserIds?.includes(uid)
    ).length;

    return {
      eventsCreated,
      eventsAttended,
      memberSince: formatMemberSince(userProfile?.createdAt),
    };
  }, [currentUser?.uid, groupedEvents, userProfile?.createdAt]);

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

    const [city, state] = (data.location || '').split(',').map((part) => part.trim());

    const payload: UpdateUserProfilePayload = {
      displayName,
      firstName: trimmedFirst,
      lastName: trimmedLast,
      avatarUrl: data.avatarUrl,
      phoneNumber: data.phone?.trim() || undefined,
      address: data.location
        ? {
            city: city || data.location.trim(),
            state: state || undefined,
          }
        : undefined,
    };

    const profileSuccess = await updateCurrentUserProfile(payload);

    let settingsSuccess = true;
    if (settings && data.language && data.language !== settings.language) {
      settingsSuccess = await updateSettings({ language: data.language });
    }

    if (profileSuccess && settingsSuccess) toast.success('Profile updated successfully.');
    else toast.error(getErrorMessage(profileError) || 'Failed to update profile.');
  };

  const handleEmailNotificationToggle = async (key: EmailNotificationKey, enabled: boolean) => {
    if (!settings) return;
    const success = await updateSettings({
      emailNotifications: { ...settings.emailNotifications, [key]: enabled },
    });
    if (success) toast.success('Notification preference saved.');
    else toast.error('Failed to update notification preference.');
  };

  const handlePushNotificationToggle = async (key: PushNotificationKey, enabled: boolean) => {
    if (!settings) return;
    const success = await updateSettings({
      pushNotifications: { ...settings.pushNotifications, [key]: enabled },
    });
    if (success) toast.success('Notification preference saved.');
    else toast.error('Failed to update notification preference.');
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

  return (
    <div className="max-w-2xl mx-auto pb-10 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground mb-1">Profile & Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </div>

      <DashboardCard className="p-6 md:p-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <ImageUploadInput
              label="profile-photo"
              variant="avatar"
              currentImageUrl={form.watch('avatarUrl')}
              storagePath="userAvatars"
              onImageUploaded={(url) => void handleAvatarUploaded(url)}
              onImageRemoved={() =>
                form.setValue('avatarUrl', '', { shouldValidate: true, shouldDirty: true })
              }
              onError={(msg) => form.setError('avatarUrl', { type: 'manual', message: msg })}
            />
          </div>
          <h2 className="font-bold text-foreground text-lg">{displayLabel}</h2>
          <p className="text-muted-foreground text-sm">{userProfile?.email || currentUser?.email}</p>
        </div>

        <div className="mt-6 space-y-2 text-left">
          {[
            { label: 'Events Created', value: String(profileStats.eventsCreated) },
            { label: 'Events Attended', value: String(profileStats.eventsAttended) },
            { label: 'Member Since', value: profileStats.memberSince },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/60"
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="font-semibold text-foreground">{row.value}</span>
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
                      <FormLabel className="text-foreground">First Name</FormLabel>
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
                      <FormLabel className="text-foreground">Last Name</FormLabel>
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
                    <FormLabel className="text-foreground">Email Address</FormLabel>
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
                    <FormLabel className="text-foreground">Phone Number</FormLabel>
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
                    <FormLabel className="text-foreground">Location</FormLabel>
                    <FormControl>
                      <Input className={dashboardInputClass} placeholder="City, State" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                disabled={isUpdating || isUpdatingSettings}
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
              <FiBell className="w-5 h-5" /> Email Notifications
            </h2>
            <div className="space-y-5">
              {emailNotificationOptions.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground text-sm">{setting.title}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <ThemeSwitch
                    checked={!!settings?.emailNotifications?.[setting.key]}
                    onCheckedChange={(enabled) => void handleEmailNotificationToggle(setting.key, enabled)}
                    disabled={!settings || isUpdatingSettings}
                    aria-label={setting.title}
                  />
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard className="p-6 md:p-8">
            <h2 className={`${dashboardSectionTitleClass} flex items-center gap-2 mb-6`}>
              <FiBell className="w-5 h-5" /> Push Notifications
            </h2>
            <div className="space-y-5">
              {pushNotificationOptions.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground text-sm">{setting.title}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <ThemeSwitch
                    checked={!!settings?.pushNotifications?.[setting.key]}
                    onCheckedChange={(enabled) => void handlePushNotificationToggle(setting.key, enabled)}
                    disabled={!settings || isUpdatingSettings}
                    aria-label={setting.title}
                  />
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard className="p-6 md:p-8">
            <h2 className={`${dashboardSectionTitleClass} flex items-center gap-2 mb-4`}>
              <FiShield className="w-5 h-5" /> Privacy & Security
            </h2>
            <div className="divide-y divide-border/30">
              <Link
                to="/auth/forgot-password"
                className="flex items-center justify-between py-4 text-foreground hover:text-secondary transition-colors"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <FiShield className="w-4 h-4" />
                  Change Password
                </span>
                <FiChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link
                to="/dashboard/settings"
                className="flex items-center justify-between py-4 text-foreground hover:text-secondary transition-colors"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <FiMoon className="w-4 h-4" />
                  App Settings
                </span>
                <FiChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link
                to="/dashboard/user/delete-my-account"
                className="flex items-center justify-between py-4 text-foreground hover:text-secondary transition-colors"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <FiUser className="w-4 h-4" />
                  Delete Account
                </span>
                <FiChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </DashboardCard>

          <DashboardCard className="p-6 md:p-8">
            <h2 className={`${dashboardSectionTitleClass} flex items-center gap-2 mb-6`}>
              <FiMoon className="w-5 h-5" /> Preferences
            </h2>
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Language</FormLabel>
                  <FormControl>
                    <Input className={dashboardInputClass} placeholder="en" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                disabled={isUpdating || isUpdatingSettings}
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
