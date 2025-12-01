import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { showValidationErrors } from "@/lib/formValidationUtils";
import { firestore } from '@/services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useVendorCategories } from '@/hooks/useVendorCategories';
import type { VendorCategory } from '@/types/vendorTypes';
import { uploadFileToStorage } from '@/services/storageService';

const VENDOR_CATEGORIES_COLLECTION = 'vendor_categories';

// Zod schema for creating a vendor category
const createCategoryFormSchema = z.object({
  // Step 1
  name: z.string().min(2, "Category name must be at least 2 characters.").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters.").max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens.")
    .optional().or(z.literal('')), // Optional, can be auto-generated
  parentCategoryId: z.string().optional().or(z.literal('')), // ID of the parent category
  // Step 2
  description: z.string().max(500).optional().or(z.literal('')),
  iconFile: z.custom<File>((val) => val instanceof File, "Please upload a valid image file for the icon.").optional(),
});

type CreateCategoryFormData = z.infer<typeof createCategoryFormSchema>;

const AdminCreateVendorCategoryPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { categories: availableParentCategories, isLoading: isLoadingParentCategories } = useVendorCategories();
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      parentCategoryId: '_NONE_', // Default to "None"
      description: '',
      iconFile: undefined,
    },
  });

  const { trigger, watch, setValue, handleSubmit, control, reset, getValues, formState } = form;

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = event.target.value;
    setValue('name', nameVal); // Use setValue from RHF
    if (!getValues('slug') || formState.dirtyFields.slug === false) {
      setValue('slug', generateSlug(nameVal), { shouldValidate: true });
    }
  };
  
  const watchedIconFile = watch("iconFile");
  useEffect(() => {
    if (watchedIconFile) {
      const previewUrl = URL.createObjectURL(watchedIconFile);
      setIconPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setIconPreview(null);
    }
  }, [watchedIconFile]);

  const onSubmitCategory = async (data: CreateCategoryFormData) => {
    setIsLoading(true);
    let uploadedIconUrl: string | undefined = undefined;

    if (data.iconFile) {
      try {
        uploadedIconUrl = await uploadFileToStorage(data.iconFile, 'vendorCategoryIcons');
      } catch (uploadError) {
        console.error("Icon upload failed:", uploadError);
        setValue("iconFile", undefined); // Clear the invalid file from form state
        setIconPreview(null);
        toast.error("Icon upload failed. Please try again.");
        setIsLoading(false);
        setCurrentStep(2); // Stay on step 2 or go back if appropriate
        return;
      }
    }

    try {
      const categoryPayload: Omit<VendorCategory, 'id'> = {
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        description: data.description || undefined,
        iconUrl: uploadedIconUrl,
        parentCategoryId: data.parentCategoryId === "_NONE_" ? undefined : (data.parentCategoryId || undefined),
      };

      const dataToSave = { ...categoryPayload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
      await addDoc(collection(firestore, VENDOR_CATEGORIES_COLLECTION), dataToSave);

      toast.success("Vendor category created successfully!");
      reset(); // Reset the entire form to defaultValues
      setIconPreview(null);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error creating vendor category:", error);
      toast.error(getErrorMessage(error) || "Failed to create vendor category.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const nextStep = async () => {
    let fieldsToValidate: (keyof CreateCategoryFormData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'slug', 'parentCategoryId'];
    }
    // No specific validation for step 2 before final submit, Zod handles it.

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      showValidationErrors(form.formState.errors, 'Please correct the errors before proceeding.');
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      {/* <h1 className="text-3xl font-bold mb-8">Create New Vendor Category</h1> Page title moved to Navbar */}
      
      <div className="mb-8 flex justify-center space-x-4">
        {[1, 2].map(step => (
          <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === step ? 'border-blue-500 bg-blue-500 text-white' : currentStep > step ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
            {step}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmitCategory, (errors) => {
          showValidationErrors(errors, 'Please correct the form errors:');
        })} className="space-y-6 max-w-2xl mx-auto">
          {currentStep === 1 && (
            <>
              <FormField control={control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Photographers" {...field} onChange={(e) => { field.onChange(e); handleNameChange(e); }} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="slug" render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl><Input placeholder="e.g., photographers" {...field} /></FormControl>
                  <FormDescription>URL-friendly version of the name (auto-generated if left empty).</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="parentCategoryId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "_NONE_"}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingParentCategories}>
                        <SelectValue placeholder={isLoadingParentCategories ? "Loading categories..." : "Select a parent category"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="_NONE_">None (Top-level category)</SelectItem>
                      {availableParentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select if this is a subcategory.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          {currentStep === 2 && (
            <>
              <FormField control={control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="A brief description of the category." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="iconFile" render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      onChange={(e) => field.onChange(e.target.files?.[0] || undefined)}
                    />
                  </FormControl>
                  <FormDescription>Upload an icon for the category.</FormDescription>
                  {iconPreview && (
                    <div className="mt-2">
                      <img src={iconPreview} alt="Icon Preview" className="h-20 w-20 object-contain border rounded-md" />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>Previous</Button>
            )}
            {currentStep < 2 && (
              <Button type="button" onClick={nextStep} className="ml-auto" disabled={isLoading}>Next</Button>
            )}
            {currentStep === 2 && (
              <Button type="submit" disabled={isLoading} className="ml-auto">
                {isLoading ? 'Creating Category...' : 'Create Category'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminCreateVendorCategoryPage;
