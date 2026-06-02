import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useAllEvents } from '@/hooks/useAllEvents';
import type { CreateEventPayload } from '@/types/eventTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DashboardCard, dashboardInputClass } from '@/components/dashboard/DashboardCard';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/formValidationUtils';

const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required.').max(100),
  date: z.string().min(1, 'Event date is required.'),
  location: z.string().min(1, 'Location is required.').max(150),
  expectedGuests: z.string().optional(),
  budget: z.string().optional(),
  description: z.string().max(2000).optional(),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

const planningTips = [
  'Choose a date at least 4-6 weeks in advance for better vendor availability',
  'Consider adding 10-15% buffer to your guest count for RSVPs',
  'Set aside 10-20% of your budget for unexpected expenses',
];

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { addEvent, isLoading } = useAllEvents();

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      date: '',
      location: '',
      expectedGuests: '',
      budget: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateEventFormData) => {
    const payload: CreateEventPayload = {
      name: data.name,
      date: data.date,
      location: data.location,
      description: data.description,
      visibility: 'private',
    };

    const success = !!(await addEvent(payload));
    if (success) {
      toast.success('Event created successfully.');
      navigate('/dashboard/events');
    } else {
      toast.error('Failed to create event.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <Link
        to="/dashboard/events"
        className="inline-flex items-center gap-2 text-sm text-[#5D2413]/70 hover:text-[#5D2413] mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl text-[#5D2413] mb-2">Create New Event</h1>
        <p className="text-muted-foreground">Start planning your next memorable gathering</p>
      </div>

      <DashboardCard className="p-6 md:p-8 mb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              showValidationErrors(errors, 'Please correct the form errors:')
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#5D2413] font-semibold">
                    Event Name <span className="text-secondary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Summer Family BBQ 2026"
                      className={dashboardInputClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5D2413] font-semibold">
                      Event Date <span className="text-secondary">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="date" className={`pl-10 ${dashboardInputClass}`} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5D2413] font-semibold">
                      Location <span className="text-secondary">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g., Central Park, NYC"
                          className={`pl-10 ${dashboardInputClass}`}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="expectedGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5D2413] font-semibold">Expected Guests</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="e.g., 50" className={`pl-10 ${dashboardInputClass}`} {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5D2413] font-semibold">Budget</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="e.g., 5000" className={`pl-10 ${dashboardInputClass}`} {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#5D2413] font-semibold">Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your event..."
                      rows={4}
                      className={dashboardInputClass}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-xl bg-secondary hover:bg-secondary/90 text-white h-12"
              >
                {isLoading ? 'Creating...' : 'Create Event'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl border-[#D6C8AF] h-12"
                onClick={() => navigate('/dashboard/events')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DashboardCard>

      <DashboardCard className="p-6 bg-[#FAF3EB] border-[#D6C8AF]/40">
        <h2 className="font-display text-lg text-[#5D2413] mb-4">Planning Tips</h2>
        <ul className="space-y-2">
          {planningTips.map((tip) => (
            <li key={tip} className="text-sm text-[#5D2413]/80 flex gap-2">
              <span className="text-secondary">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </DashboardCard>
    </div>
  );
};

export default CreateEventPage;
