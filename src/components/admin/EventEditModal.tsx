import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showValidationErrors } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import type { Event, CreateEventPayload, UpdateEventPayload, WebsitePayload, UpdateEventWebsiteDetailsPayload } from '@/types/eventTypes';
import type { UseFormReturn } from 'react-hook-form';
import type { Theme } from '@/types/themeTypes';
import { useAllThemes } from '@/hooks/useAllThemes';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { suggestEventSlug } from '@/utils/eventUrlUtils';

// Schema for Step 1: Event Details
const eventDetailsFormSchema = z.object({
  name: z.string().min(1, "Event name is required.").max(100),
  description: z.string().max(2000).optional().or(z.literal('')),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM).").optional().or(z.literal('')),
  location: z.string().max(150).optional().or(z.literal('')),
  visibility: z.enum(['public', 'private', 'unlisted'], { required_error: "Visibility is required." }),
  themeId: z.string().optional().nullable(),
  needsWebsite: z.boolean(),
});
export type EventDetailsFormData = z.infer<typeof eventDetailsFormSchema>;

// Schema for Step 3: Website Details
const eventWebsiteFormSchema = z.object({
  websiteTitle: z.string().max(100).optional().or(z.literal('')),
  websiteWelcomeMessage: z.string().max(2000).optional(),
  websiteHeaderImageUrl: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, { message: "Please enter a valid URL." }),
  websiteCustomUrlSlug: z.string().max(50).regex(/^[a-z0-9-]*$/, "Slug can only contain lowercase letters, numbers, and hyphens.").optional().or(z.literal('')),
  websitePublished: z.boolean(),
});
export type EventWebsiteFormData = z.infer<typeof eventWebsiteFormSchema>;

interface EventEditModalProps {
  event?: Event | null;
  eventWebsiteDetails?: WebsitePayload | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    eventData: CreateEventPayload | UpdateEventPayload,
    websiteData: UpdateEventWebsiteDetailsPayload | undefined,
    eventId?: string
  ) => Promise<void>;
  isUpdating?: boolean;
  mode: 'create' | 'edit';
}

const EventEditModal: React.FC<EventEditModalProps> = ({
  event,
  eventWebsiteDetails,
  isOpen,
  onClose,
  onSubmit,
  isUpdating,
  mode,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { allThemes, isLoading: isLoadingThemes } = useAllThemes();

  // Form for Step 1: Event Details
  const eventDetailsForm = useForm<EventDetailsFormData>({
    resolver: zodResolver(eventDetailsFormSchema),
    defaultValues: {
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      visibility: 'private',
      themeId: null,
      needsWebsite: false,
    },
  });

  // Form for Step 3: Website Details
  const websiteDetailsForm = useForm<EventWebsiteFormData>({
    resolver: zodResolver(eventWebsiteFormSchema),
    defaultValues: {
      websiteTitle: '',
      websiteWelcomeMessage: '',
      websiteHeaderImageUrl: '',
      websiteCustomUrlSlug: '',
      websitePublished: false,
    },
  });

  // State for Step 2: Website Theme Selection
  const [selectedWebsiteThemeId, setSelectedWebsiteThemeId] = useState<string | null>(null);

  // Watch event name and date for URL slug suggestion
  const eventName = eventDetailsForm.watch('name');
  const eventDate = eventDetailsForm.watch('date');
  const needsWebsite = eventDetailsForm.watch('needsWebsite');

  // Update suggested URL slug when name or date changes
  useEffect(() => {
    if (eventName && eventDate && mode === 'create') {
      const suggestedSlug = suggestEventSlug(eventName, eventDate);
      websiteDetailsForm.setValue('websiteCustomUrlSlug', suggestedSlug);
    }
  }, [eventName, eventDate, mode, websiteDetailsForm]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && event) {
        // Reset event details form
        eventDetailsForm.reset({
          name: event.name || '',
          description: event.description || '',
          date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
          time: event.time || '',
          location: event.location || '',
          visibility: 'private',
          themeId: event.themeId || null,
          needsWebsite: !!eventWebsiteDetails,
        });

        // Reset website details form with proper website data
        if (eventWebsiteDetails) {
          websiteDetailsForm.reset({
            websiteTitle: eventWebsiteDetails.title || '',
            websiteWelcomeMessage: eventWebsiteDetails.welcomeMessage || '',
            websiteHeaderImageUrl: eventWebsiteDetails.headerImageUrl || '',
            websiteCustomUrlSlug: eventWebsiteDetails.customUrlSlug || '',
            websitePublished: eventWebsiteDetails.published || false,
          });
          setSelectedWebsiteThemeId(eventWebsiteDetails.websiteThemeId || null);
        } else {
          // If no website details exist, reset to empty values
          websiteDetailsForm.reset({
            websiteTitle: '',
            websiteWelcomeMessage: '',
            websiteHeaderImageUrl: '',
            websiteCustomUrlSlug: '',
            websitePublished: false,
          });
          setSelectedWebsiteThemeId(null);
        }
      } else {
        // Reset forms to initial state for create mode
        eventDetailsForm.reset({
          name: '',
          description: '',
          date: '',
          time: '',
          location: '',
          visibility: 'private',
          themeId: null,
          needsWebsite: false,
        });
        // Explicitly reset website form with empty values
        websiteDetailsForm.reset({
          websiteTitle: '',
          websiteWelcomeMessage: '',
          websiteHeaderImageUrl: '',
          websiteCustomUrlSlug: '',
          websitePublished: false,
        });
        setSelectedWebsiteThemeId(null);
        setCurrentStep(1);
      }
    }
  }, [event, eventWebsiteDetails, isOpen, mode, eventDetailsForm, websiteDetailsForm]);

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await eventDetailsForm.trigger();
      if (isValid) {
        if (needsWebsite) {
          setCurrentStep(2);
        } else {
          // Skip to final submission if no website needed
          const detailsData = eventDetailsForm.getValues();
          // Create empty website form data when no website is needed
          const websiteFormData = {
            websiteTitle: '',
            websiteWelcomeMessage: '',
            websiteHeaderImageUrl: '',
            websiteCustomUrlSlug: '',
            websitePublished: false,
          };
          await handleFinalSubmit(detailsData, websiteFormData);
        }
      } else {
        showValidationErrors(eventDetailsForm.formState.errors, 'Please correct the form errors before proceeding.');
      }
    } else if (currentStep === 2) {
      const isValid = await websiteDetailsForm.trigger();
      if (isValid) {
        setCurrentStep(3);
      } else {
        showValidationErrors(websiteDetailsForm.formState.errors, 'Please correct the website form errors before proceeding.');
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async (
    detailsData: EventDetailsFormData,
    websiteFormData: EventWebsiteFormData
  ) => {
    const eventPayloadData = {
      name: detailsData.name,
      description: detailsData.description || undefined,
      date: detailsData.date,
      time: detailsData.time || undefined,
      location: detailsData.location || undefined,
      visibility: detailsData.visibility,
      ...(detailsData.themeId !== "__NONE__" && detailsData.themeId ? { themeId: detailsData.themeId } : {}),
    };

    // Only include website data if user wants a website AND there's actual content
    const hasWebsiteContent = detailsData.needsWebsite && (
      (websiteFormData.websiteTitle && websiteFormData.websiteTitle.trim()) ||
      (websiteFormData.websiteWelcomeMessage && websiteFormData.websiteWelcomeMessage.trim()) ||
      (websiteFormData.websiteHeaderImageUrl && websiteFormData.websiteHeaderImageUrl.trim()) ||
      (websiteFormData.websiteCustomUrlSlug && websiteFormData.websiteCustomUrlSlug.trim()) ||
      websiteFormData.websitePublished
    );

    const websitePayloadData: UpdateEventWebsiteDetailsPayload | undefined = hasWebsiteContent ? {
      title: websiteFormData.websiteTitle?.trim() ? websiteFormData.websiteTitle.trim() : undefined,
      welcomeMessage: websiteFormData.websiteWelcomeMessage?.trim() ? websiteFormData.websiteWelcomeMessage.trim() : undefined,
      headerImageUrl: websiteFormData.websiteHeaderImageUrl?.trim() ? websiteFormData.websiteHeaderImageUrl.trim() : undefined,
      customUrlSlug: websiteFormData.websiteCustomUrlSlug?.trim() ? websiteFormData.websiteCustomUrlSlug.trim() : undefined,
      published: websiteFormData.websitePublished,
      websiteThemeId: selectedWebsiteThemeId === "__NONE__" || !selectedWebsiteThemeId ? undefined : selectedWebsiteThemeId,
    } : undefined;

    if (mode === 'edit' && event?.id) {
      await onSubmit(eventPayloadData as UpdateEventPayload, websitePayloadData, event.id);
    } else if (mode === 'create') {
      await onSubmit(eventPayloadData as CreateEventPayload, websitePayloadData);
    }
  };

  const renderStepContent = (currentStep: number, eventDetailsForm: UseFormReturn<EventDetailsFormData>, websiteDetailsForm: UseFormReturn<EventWebsiteFormData>, selectedWebsiteThemeId: string | null, allThemes: Theme[], isLoadingThemes: boolean, setSelectedWebsiteThemeId: (id: string | null) => void) => {
    switch (currentStep) {
      case 1: // Event Details
        return (
          <form className="space-y-4 py-2">
            <FormField control={eventDetailsForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={eventDetailsForm.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} rows={3} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={eventDetailsForm.control} name="date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={eventDetailsForm.control} name="time" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (HH:MM)</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select event time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField control={eventDetailsForm.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={eventDetailsForm.control} name="visibility" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="unlisted">Unlisted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={eventDetailsForm.control} name="themeId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Theme</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "__NONE__" ? null : value)}
                      defaultValue={field.value || "__NONE__"}
                      disabled={isLoadingThemes}
                    >
                      <FormControl><SelectTrigger><SelectValue placeholder="Select event theme" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="__NONE__">None</SelectItem>
                        {allThemes.map(themeOption => (
                          <SelectItem key={themeOption.id} value={themeOption.id}>{themeOption.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField control={eventDetailsForm.control} name="needsWebsite" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Create a website for this event</FormLabel>
                    <DialogDescription>Check this if you want to create a mini-website for your event with additional details, themes, and custom URL.</DialogDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        );
      case 2: // Website Theme
        return (
          <div className="space-y-4 py-2">
            <FormItem>
              <FormLabel>Website Theme</FormLabel>
              <Select
                onValueChange={(value) => setSelectedWebsiteThemeId(value === "__NONE__" ? null : value)}
                defaultValue={selectedWebsiteThemeId || "__NONE__"}
                disabled={isLoadingThemes}
              >
                <FormControl><SelectTrigger><SelectValue placeholder="Select theme for website" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="__NONE__">None (Use Event Theme or Default)</SelectItem>
                  {allThemes.map(themeOption => (
                    <SelectItem key={themeOption.id} value={themeOption.id}>{themeOption.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
            <p className="text-sm text-muted-foreground">
              Select a specific theme for the event's mini-website. If "None" is selected, it may inherit the main event theme or use a system default.
            </p>
          </div>
        );
      case 3: // Website Details
        return (
          <form className="space-y-4 py-2">
            <FormField control={websiteDetailsForm.control} name="websiteTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Title</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g., John & Jane's Wedding" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={websiteDetailsForm.control} name="websiteWelcomeMessage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message</FormLabel>
                  <FormControl><Textarea {...field} rows={3} placeholder="A short welcome message for your event website." /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={websiteDetailsForm.control} name="websiteHeaderImageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Header Image URL</FormLabel>
                  <FormControl><Input {...field} placeholder="https://example.com/image.jpg" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={websiteDetailsForm.control} name="websiteCustomUrlSlug" render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom URL Slug</FormLabel>
                  <FormControl><Input {...field} placeholder="john-jane-wedding" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={websiteDetailsForm.control} name="websitePublished" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Publish Website</FormLabel>
                    <DialogDescription>Make the event website live and accessible.</DialogDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) { onClose(); setCurrentStep(1); } }}>
      <DialogContent className="w-full max-w-md sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' && event ? `Edit Event: ${event.name}` : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? "Update the event details, theme, and website settings." : "Fill in the details for the new event across the steps."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={`step-${currentStep}`} className="w-full pt-2">
          <TabsList className={`grid w-full ${needsWebsite ? 'grid-cols-3' : 'grid-cols-1'}`}>
            <TabsTrigger value="step-1" onClick={() => setCurrentStep(1)} disabled={currentStep < 1}>Details</TabsTrigger>
            {needsWebsite && (
              <>
                <TabsTrigger value="step-2" onClick={() => setCurrentStep(2)} disabled={currentStep < 2 && !eventDetailsForm.formState.isValid}>Theme</TabsTrigger>
                <TabsTrigger value="step-3" onClick={() => setCurrentStep(3)} disabled={currentStep < 3 && !eventDetailsForm.formState.isValid}>Website</TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
        <FormProvider {...eventDetailsForm} {...websiteDetailsForm}>
          <div className="py-4 max-h-[60vh] overflow-y-auto px-1">
           {renderStepContent(currentStep, eventDetailsForm, websiteDetailsForm, selectedWebsiteThemeId, allThemes, isLoadingThemes, setSelectedWebsiteThemeId)}
          </div>
        </FormProvider>

        <DialogFooter className="mt-4">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handlePreviousStep} disabled={isUpdating}>
              Previous
            </Button>
          )}
          <DialogClose asChild>
            <Button type="button" variant="ghost" onClick={() => { onClose(); setCurrentStep(1); }} disabled={isUpdating}>
              Cancel
            </Button>
          </DialogClose>
          {currentStep < (needsWebsite ? 3 : 1) ? (
            <Button type="button" onClick={handleNextStep} disabled={isUpdating || (currentStep === 1 && !eventDetailsForm.formState.isValid) }>
              {needsWebsite ? 'Next' : 'Create Event'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                eventDetailsForm.handleSubmit((detailsData) => {
                  websiteDetailsForm.handleSubmit((websiteData) => {
                    handleFinalSubmit(detailsData, websiteData);
                  }, (errors) => {
                    showValidationErrors(errors, 'Please correct the website form errors:');
                  })(); // Trigger website form submission
                }, (errors) => {
                  showValidationErrors(errors, 'Please correct the event form errors:');
                })(); // Trigger details form submission
              }}
              disabled={isUpdating || !eventDetailsForm.formState.isValid}
            >
              {isUpdating ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Event')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditModal;
