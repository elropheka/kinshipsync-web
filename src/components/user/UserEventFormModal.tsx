import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showValidationErrors } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import EventWebsiteForm from '../website/EventWebsiteForm';
import type { Event, CreateEventPayload, UpdateEventPayload, WebsitePayload } from '@/types/eventTypes';

// Schema for the event form
const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required.").max(100),
  description: z.string().max(2000).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM).").optional(),
  location: z.string().max(150).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
});

// Website form schema
const websiteFormSchema = z.object({
  title: z.string().optional(),
  customUrlSlug: z.string().optional(),
  welcomeMessage: z.string().optional(),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    order: z.number()
  })).optional(),
  published: z.boolean().optional(),
  websiteThemeId: z.string().optional(),
  headerImageUrl: z.string().optional()
});

export type UserEventFormData = z.infer<typeof eventFormSchema>;
export type WebsiteFormData = z.infer<typeof websiteFormSchema>;

interface ExtendedEvent extends Omit<Event, 'website'> {
  website?: WebsitePayload;
}

interface UserEventFormModalProps {
  event?: ExtendedEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventPayload | UpdateEventPayload, eventId?: string) => Promise<void>;
  isProcessing?: boolean;
  mode: 'create' | 'edit';
}

const UserEventFormModal: React.FC<UserEventFormModalProps> = ({ event, isOpen, onClose, onSubmit, isProcessing, mode }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'website'>('details');
  const eventForm = useForm<UserEventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      description: undefined,
      date: '',
      time: undefined,
      location: undefined,
      visibility: 'private',
    },
  });

  const websiteForm = useForm<WebsiteFormData>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      title: '',
      customUrlSlug: '',
      welcomeMessage: '',
      sections: [],
      published: false
    }
  });

  useEffect(() => {
    if (mode === 'edit' && event) {
      eventForm.reset({
        name: event.name || '',
        description: event.description || undefined,
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        time: event.time || undefined,
        location: event.location || undefined,
        visibility: event.visibility || 'private',
      });
    } else {
      eventForm.reset({ 
        name: '', 
        description: undefined, 
        date: '', 
        time: undefined, 
        location: undefined, 
        visibility: 'private' 
      });
    }
  }, [event, eventForm, isOpen, mode]);

  const handleFormSubmit = async (data: UserEventFormData) => {
    // Check for validation errors before proceeding
    if (!eventForm.formState.isValid) {
      showValidationErrors(eventForm.formState.errors, 'Please correct the form errors:');
      return;
    }

    try {
      const formData = websiteForm.getValues();
      // Only include website data if there's actual content
      const hasWebsiteContent = (formData.title && formData.title.trim()) || 
                              (formData.customUrlSlug && formData.customUrlSlug.trim()) || 
                              (formData.welcomeMessage && formData.welcomeMessage.trim()) || 
                              (formData.sections && formData.sections.length > 0);

      const websitePayload = hasWebsiteContent ? {
        title: formData.title?.trim() || undefined,
        customUrlSlug: formData.customUrlSlug?.trim() || undefined,
        welcomeMessage: formData.welcomeMessage?.trim() || undefined,
        sections: formData.sections || [],
        published: formData.published || false,
        websiteThemeId: formData.websiteThemeId,
        headerImageUrl: formData.headerImageUrl?.trim() || undefined
      } : undefined;

      if (mode === 'edit' && event) {
        const payload: UpdateEventPayload = {
          name: data.name,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location,
          visibility: data.visibility,
          website: websitePayload
        };
        await onSubmit(payload, event.id);
      } else if (mode === 'create') {
        const payload: CreateEventPayload = {
          name: data.name,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location,
          visibility: data.visibility,
          website: websitePayload
        };
        await onSubmit(payload);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className="w-full max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Make changes to your event.' : 'Fill in the details for your new event.'}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'details' | 'website')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Form {...eventForm}>
              <form onSubmit={eventForm.handleSubmit(handleFormSubmit)} className="space-y-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eventForm.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Event Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eventForm.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eventForm.control} name="date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={eventForm.control} name="time" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (Optional)</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select event time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={eventForm.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eventForm.control} name="visibility" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></DialogClose>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Event')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="website">
            <EventWebsiteForm
              initialWebsiteData={event?.website ? {
                title: event.website.title,
                customUrlSlug: event.website.customUrlSlug,
                welcomeMessage: event.website.welcomeMessage,
                sections: event.website.sections,
                published: event.website.published,
                websiteThemeId: event.website.websiteThemeId,
                headerImageUrl: event.website.headerImageUrl
              } : undefined}
              onSubmit={async (websiteData) => {
                websiteForm.reset(websiteData);
                setActiveTab('details');
              }}
              onCancel={() => setActiveTab('details')}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserEventFormModal;
