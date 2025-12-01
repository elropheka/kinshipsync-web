import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddNewCategoryModal from './AddNewCategoryModal';
import type { VendorCategory } from '@/types/vendorTypes';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { useVendorCategories } from '@/hooks/useVendorCategories';
import type { VendorProfileFormData } from '@/pages/admin/RegisterVendor';

// Removed form prop, will use useFormContext
const VendorStep1Form: React.FC = () => {
  const { categories: availableCategories, isLoading: isLoadingCategories, refetchCategories } = useVendorCategories();
  const { control, setValue, getValues } = useFormContext<VendorProfileFormData>(); // Use context
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryAdded = (newCategory: VendorCategory) => {
    refetchCategories(); // Refetch to ensure the list is up-to-date
    // Automatically select the newly added category
    const currentCategoryIds = getValues('categoryIds') || [];
    if (newCategory.id && !currentCategoryIds.includes(newCategory.id)) {
      setValue('categoryIds', [...currentCategoryIds, newCategory.id], { shouldValidate: true, shouldDirty: true });
    }
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="space-y-8">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vendor Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Business Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us about your services" {...field} rows={5} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <div className="flex justify-between items-center mb-1">
          <FormLabel>Vendor Categories</FormLabel>
          <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <FormDescription>Select the categories your services fall into. Click 'Add New' if a category is missing.</FormDescription>
        {isLoadingCategories ? (
          <p className="mt-2">Loading categories...</p>
        ) : availableCategories.length === 0 && !isLoadingCategories ? (
          <p className="mt-2 text-sm text-muted-foreground">No categories available. Click 'Add New' to create one.</p>
        ) : (
          <FormField
            control={control}
            name="categoryIds"
            render={() => (
              <FormItem className="space-y-2 mt-2">
                {availableCategories.map((category) => (
                  <FormField
                    key={category.id}
                    control={control}
                    name="categoryIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                const currentCategoryIds = field.value || [];
                                return checked
                                  ? field.onChange([...currentCategoryIds, category.id])
                                  : field.onChange(
                                      currentCategoryIds.filter(
                                        (value) => value !== category.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <AddNewCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
};

export default VendorStep1Form;
