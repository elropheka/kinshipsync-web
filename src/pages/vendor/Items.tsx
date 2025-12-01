import React, { useState, useMemo, useCallback } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { getVendorItemColumns } from './vendorItemColumns';
import { useVendorItems } from '@/hooks/useVendorItems';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import VendorItemFormModal from '@/components/vendor/VendorItemFormModal';
import type { VendorItem } from '@/types/vendorItemTypes';
import type { VendorItemFormData } from '@/schemas/vendorItemSchema'; // Corrected import path
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger, // We'll trigger programmatically
} from "@/components/ui/alert-dialog"; // Added AlertDialog

const VendorItemsPage: React.FC = () => {
  const { items, isLoading, error, addItem, updateItem, deleteItem } = useVendorItems();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = useCallback((item: VendorItem) => { 
    setEditingItem(item);
    setIsModalOpen(true);
  }, []); // Empty dependency array as setEditingItem and setIsModalOpen are stable
  
  const handleDeleteItem = useCallback(async (itemId: string) => {
    setItemToDeleteId(itemId);
    setIsDeleteDialogOpen(true);
  }, []); 

  const confirmDeleteItem = async () => {
    if (itemToDeleteId) {
      const success = await deleteItem(itemToDeleteId);
      if (success) {
        toast.success("Item deleted successfully.");
      } else {
        toast.error("Failed to delete item.");
      }
      setItemToDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns = useMemo(
    () => getVendorItemColumns(handleEditItem, handleDeleteItem),
    [handleEditItem, handleDeleteItem] // Added handlers to dependency array
  );

  if (error) {
    toast.error(getErrorMessage(error));
    return (
      <div className="flex flex-col justify-center items-center h-full p-4">
        <p className="text-muted-foreground mb-4">Unable to load items. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }

  const handleFormSubmit = async (data: VendorItemFormData, itemId?: string) => {
    let success = false;
    if (itemId) {
      success = !!(await updateItem(itemId, data)); // updateItem should return VendorItem | null
    } else {
      success = !!(await addItem(data)); // addItem should return VendorItem | null
    }
    
    if (success) {
      toast.success(`Item ${itemId ? 'updated' : 'added'} successfully.`);
      setIsModalOpen(false);
      setEditingItem(null);
    } else {
      toast.error(`Failed to ${itemId ? 'update' : 'add'} item.`);
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-3xl font-bold">Manage Your Items/Services</h1> Page title moved to Navbar */}
        <Button 
          onClick={handleAddNewItem} 
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
        </Button>
      </div>
      
      {!isLoading && !error && items.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No items yet!</h2>
          <p className="text-muted-foreground mb-4">
            Start by adding your first item or service to showcase to clients.
          </p>
          <Button 
            onClick={handleAddNewItem} 
            size="lg"
            className="flex items-center mx-auto"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Item
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns} 
          data={items}
          isLoading={isLoading}
          // globalFilterPlaceholder="Search your items..."
        />
      )}

      <VendorItemFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        isLoading={isLoading} 
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendorItemsPage;
