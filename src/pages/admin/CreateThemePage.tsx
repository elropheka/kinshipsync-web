import React, { useState } from 'react';
import { useForm, type Path } from 'react-hook-form'; // Used type-only import for Path
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Removed FormDescription
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { showValidationErrors } from "@/lib/formValidationUtils";
import { firestore } from '@/services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { createThemeFormSchema, type CreateThemeFormData } from '@/schemas/themeSchema';
import type { CreateThemePayload } from '@/types/themeTypes';
import { AppColors } from '@/theme/appTheme'; // Import AppColors instead

const THEMES_COLLECTION = 'themes';

const fontWeightOptions = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const fontStyleOptions = ['normal', 'italic'];

const AdminCreateThemePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CreateThemeFormData>({
    resolver: zodResolver(createThemeFormSchema),
    defaultValues: {
      name: '',
      // Use AppColors.light as the base for default color values
      colors: AppColors.light, // AppColors.light already matches ThemeColors type
      fonts: {
        heading: { fontFamily: 'Arial, sans-serif', fontWeight: 'bold' },
        body: { fontFamily: 'Arial, sans-serif', fontWeight: 'normal' },
      },
    },
  });

  const onSubmitTheme = async (data: CreateThemeFormData) => {
    setIsLoading(true);
    try {
      // Ensure all required color properties are present
      const themePayload: CreateThemePayload = {
        name: data.name,
        colors: {
          ...AppColors.light, // Base colors
          ...data.colors, // Override with user-provided colors
        },
        fonts: data.fonts,
        // isPredefined will be false or undefined by default for admin-created themes
      };

      const dataToSave = {
        ...themePayload,
        isPredefined: false, // Explicitly set for admin created themes
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, THEMES_COLLECTION), dataToSave);

      toast.success(`Theme "${data.name}" created successfully!`);
      form.reset(); // Reset form to default values
    } catch (error) {
      console.error("Error creating theme:", error);
      toast.error(getErrorMessage(error) || "Failed to create theme. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { trigger, getValues } = form; // getValues was missing from destructuring

  const nextStep = async () => {
    const fieldsToValidate: Path<CreateThemeFormData>[] = ['name'];
    // Add all color fields for validation
    const colorKeys = Object.keys(getValues().colors) as Array<keyof CreateThemeFormData['colors']>;
    colorKeys.forEach(key => fieldsToValidate.push(`colors.${key}` as Path<CreateThemeFormData>));

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      showValidationErrors(form.formState.errors, 'Please correct the errors in Name or Colors before proceeding.');
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      {/* <h1 className="text-3xl font-bold mb-8">Create New Theme</h1> Page title moved to Navbar */}

      {/* Stepper UI */}
      <div className="mb-8 flex justify-center space-x-4">
        {[1, 2].map(step => (
          <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === step ? 'border-blue-500 bg-blue-500 text-white' : currentStep > step ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
            {step}
          </div>
        ))}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitTheme, (errors) => {
          showValidationErrors(errors, 'Please correct the form errors:');
        })} className="space-y-8 max-w-3xl mx-auto">
          {currentStep === 1 && (
            <>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Midnight Blue" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <h2 className="text-xl font-semibold border-b pb-2 pt-4">Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Object.keys(form.getValues().colors) as Array<keyof CreateThemeFormData['colors']>).map((colorKey) => (
                  <FormField key={colorKey} control={form.control} name={`colors.${colorKey}`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{colorKey.replace(/([A-Z])/g, ' $1')}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl><Input type="text" placeholder="#RRGGBB" {...field} /></FormControl>
                        <div style={{ width: '24px', height: '24px', backgroundColor: field.value, border: '1px solid hsl(var(--border))' }} />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-xl font-semibold border-b pb-2 pt-4">Fonts</h2>
              {/* Heading Font */}
              <div className="p-4 border rounded-md space-y-4">
                <h3 className="text-lg font-medium">Heading Font</h3>
                <FormField control={form.control} name="fonts.heading.fontFamily" render={({ field }) => (
                  <FormItem><FormLabel>Font Family</FormLabel><FormControl><Input placeholder="e.g., Arial, sans-serif" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fonts.heading.fontWeight" render={({ field }) => (
                  <FormItem><FormLabel>Font Weight</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select weight" /></SelectTrigger></FormControl>
                      <SelectContent>{fontWeightOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="fonts.heading.fontStyle" render={({ field }) => (
                  <FormItem><FormLabel>Font Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger></FormControl>
                      <SelectContent>{fontStyleOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Body Font */}
              <div className="p-4 border rounded-md space-y-4">
                <h3 className="text-lg font-medium">Body Font</h3>
                <FormField control={form.control} name="fonts.body.fontFamily" render={({ field }) => (
                  <FormItem><FormLabel>Font Family</FormLabel><FormControl><Input placeholder="e.g., Verdana, sans-serif" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fonts.body.fontWeight" render={({ field }) => (
                  <FormItem><FormLabel>Font Weight</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select weight" /></SelectTrigger></FormControl>
                      <SelectContent>{fontWeightOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="fonts.body.fontStyle" render={({ field }) => (
                  <FormItem><FormLabel>Font Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger></FormControl>
                      <SelectContent>{fontStyleOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
              </div>
            </>
          )}
          
          <div className="flex justify-between mt-10">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>Previous</Button>
            )}
            {currentStep < 2 && (
              <Button type="button" onClick={nextStep} className="ml-auto" disabled={isLoading}>Next</Button>
            )}
            {currentStep === 2 && (
              <Button type="submit" disabled={isLoading} className="ml-auto">
                {isLoading ? 'Creating Theme...' : 'Create Theme'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminCreateThemePage;
