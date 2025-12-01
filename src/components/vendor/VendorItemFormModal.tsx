import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showZodValidationErrors, showValidationErrors, handleFormValidation } from '@/lib/formValidationUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import VendorItemStep1Form from './VendorItemStep1Form';
import VendorItemStep2Form from './VendorItemStep2Form';
import { vendorItemSchema, type VendorItemFormData } from '@/schemas/vendorItemSchema'; // VendorItemFormData as type-only, removed getVendorItemSchemaForStep
import type { VendorItem } from '@/types/vendorItemTypes'; // Removed CreateVendorItemPayload

interface VendorItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VendorItemFormData, itemId?: string) => Promise<void>; // Expect VendorItemFormData
  initialData?: VendorItem | null;
  isLoading?: boolean;
}

const TOTAL_STEPS = 2;

const VendorItemFormModal: React.FC<VendorItemFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<VendorItemFormData>({
    resolver: zodResolver(vendorItemSchema), // Use the full schema for the resolver
    defaultValues: initialData 
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          category: initialData.category,
          imageUrl: initialData.imageUrl || '',
          availability: initialData.availability || '',
          location: initialData.location || '',
        }
      : {
          name: '',
          description: '',
          // price: undefined, // Let placeholder handle it, or set to 0 or ''
          category: '',
          imageUrl: '',
          availability: '',
          location: '',
        },
    mode: 'onChange', // Validate on change for better UX
  });

  useEffect(() => {
    // Reset form and step when modal opens or initialData changes
    if (isOpen) {
      setCurrentStep(1);
      methods.reset(initialData ? {
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        category: initialData.category,
        imageUrl: initialData.imageUrl || '',
        availability: initialData.availability || '',
        location: initialData.location || '',
      } : {
        name: '',
        description: '',
        category: '',
        imageUrl: '',
        availability: '',
        location: '',
      });
    }
  }, [isOpen, initialData, methods]);

  // Removed useEffect for dynamic resolver, as we now use the full schema.
  // Validation for next step is handled in handleNext.

  const handleNext = async () => {
    let fieldsToValidate: (keyof VendorItemFormData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'category', 'description'];
    }
    // Add other steps here if TOTAL_STEPS > 2

    const isValid = await methods.trigger(fieldsToValidate);
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else if (!isValid) {
      const errors = methods.formState.errors;
      showValidationErrors(errors, 'Please correct the errors before proceeding.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onFormSubmit = async (data: VendorItemFormData) => {
    // Ensure all fields are validated by the full schema before final submission
    const fullValidation = vendorItemSchema.safeParse(data);
    if (!fullValidation.success) {
      // This should ideally not happen if step validations are correct
      // but as a safeguard:
      console.error("Full form validation failed:", fullValidation.error.flatten().fieldErrors);
      showZodValidationErrors(fullValidation.error, 'Please correct the form errors:');
      // Update form errors to show them
      Object.entries(fullValidation.error.flatten().fieldErrors).forEach(([fieldName, errors]) => {
        if (errors) {
          methods.setError(fieldName as keyof VendorItemFormData, { type: 'manual', message: errors.join(', ') });
        }
      });
      return;
    }
    await onSubmit(fullValidation.data, initialData?.id);
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setCurrentStep(1); // Reset step when closing
        methods.reset(); // Reset form
      }
    }}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Item/Service' : 'Add New Item/Service'} - Step {currentStep} of {TOTAL_STEPS}</DialogTitle>
          <DialogDescription>
            {initialData ? "Make changes to your item/service here." : "Fill in the details for your new item/service."}
          </DialogDescription>
        </DialogHeader>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onFormSubmit)} className="space-y-8">
            {currentStep === 1 && <VendorItemStep1Form />}
            {currentStep === 2 && <VendorItemStep2Form />}

            <DialogFooter className="pt-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious} disabled={isLoading}>
                  Previous
                </Button>
              )}
              {currentStep < TOTAL_STEPS && (
                <Button type="button" onClick={handleNext} disabled={isLoading}>
                  Next
                </Button>
              )}
              {currentStep === TOTAL_STEPS && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Item')}
                </Button>
              )}
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default VendorItemFormModal;
