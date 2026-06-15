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
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
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
        toast.error(getErrorMessage(error) || "Failed to delete item.");
      }
      setItemToDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns = useMemo(
    () => getVendorItemColumns(handleEditItem, handleDeleteItem),
    [handleEditItem, handleDeleteItem] // Added handlers to dependency array
  );

  useErrorToast(error, { title: 'Unable to load items' });

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Unable to load items"
        onRetry={() => window.location.reload()}
        retryLabel="Reload Page"
      />
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
          renderMobileCard={(item: VendorItem) => {
            const price = typeof item.price === 'number'
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price)
              : item.price;
            return (
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <p className="font-semibold text-foreground text-sm shrink-0">{String(price)}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {item.availability && (
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                      {item.availability}
                    </span>
                  )}
                  {item.location && <span>{item.location}</span>}
                  {item.updatedAt && (
                    <span className="ml-auto">Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleEditItem(item)}>Edit</Button>
                  <Button variant="destructive" size="sm" className="h-8 text-xs ml-auto" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                </div>
              </div>
            );
          }}
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
