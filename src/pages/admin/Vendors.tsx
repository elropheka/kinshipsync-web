import React, { useMemo, useCallback, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { getAdminVendorColumns } from './adminVendorColumns';
import { useAllVendors } from '@/hooks/useAllVendors';
import { useAllUsers } from '@/hooks/useAllUsers'; // Import useAllUsers
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import type { Vendor, UpdateVendorProfilePayload } from "@/types/vendorTypes";
// import type { UserProfile } from '@/types/userTypes'; // Import UserProfile - Removed as it might be unused
import VendorEditModal from '@/components/admin/VendorEditModal';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

const AdminVendorsPage: React.FC = () => {
  const { vendors, isLoading, error, adminToggleVendorFeature, adminUpdateVendorProfile, adminDeleteVendor } = useAllVendors();
  const { users, adminUpdateUserProfile: updateUserProfileRoles } = useAllUsers(); // Get users and the updater
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isVendorEditModalOpen, setIsVendorEditModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null); // For delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdatingVendor, setIsUpdatingVendor] = useState(false);


  const handleToggleFeature = useCallback(async (vendorId: string, currentStatus: boolean) => {
    const success = await adminToggleVendorFeature(vendorId, currentStatus);
    if (success) {
      toast.success(`Vendor feature status ${currentStatus ? "removed" : "added"}.`);
      // fetchAllVendors(); // Already handled by optimistic update in useAllVendors
    } else {
      toast.error("Failed to update vendor feature status.");
    }
  }, [adminToggleVendorFeature]);

  const handleEditVendor = useCallback((vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsVendorEditModalOpen(true);
  }, []);

  const handleVendorModalClose = () => {
    setIsVendorEditModalOpen(false);
    setEditingVendor(null);
  };

  const handleVendorModalSubmit = async (vendorId: string, updatedData: UpdateVendorProfilePayload) => {
    if (!adminUpdateVendorProfile) {
        toast.error("Update function not available.");
        return;
    }
    setIsUpdatingVendor(true);
    const success = await adminUpdateVendorProfile(vendorId, updatedData);
    if (success) {
      toast.success("Vendor profile updated.");
      handleVendorModalClose();
      // fetchAllVendors(); // Already handled by adminUpdateVendorProfile in useAllVendors
    } else {
      toast.error("Failed to update vendor profile.");
    }
    setIsUpdatingVendor(false);
  };

  const columns = useMemo(() => {
    return getAdminVendorColumns(handleToggleFeature, handleEditVendor, (vendor: Vendor) => {
      setVendorToDelete(vendor);
      setIsDeleteDialogOpen(true);
    });
  }, [handleToggleFeature, handleEditVendor]);

  const confirmDeleteVendor = async () => {
    if (!vendorToDelete || !adminDeleteVendor || !updateUserProfileRoles) {
      toast.error("Delete operation failed. Required resources missing.");
      setIsDeleteDialogOpen(false);
      setVendorToDelete(null);
      return;
    }

    const vendorId = vendorToDelete.id; // Assuming vendor ID is the user ID

    // Step 1: Delete vendor profile
    const vendorDeleteSuccess = await adminDeleteVendor(vendorId);

    if (vendorDeleteSuccess) {
      toast.success(`Vendor ${vendorToDelete.name} deleted.`);

      // Step 2: Update user role
      const userToUpdate = users.find(u => u.userId === vendorId);
      if (userToUpdate) {
        let newRole: "organizer" | "admin" | "vendor" = 'organizer'; // Default to 'organizer'
        
        // If the user is an admin, their role should remain 'admin'
        // Assuming 'role' is the singular field in UserProfile as per latest feedback
        // And AdminUpdateUserProfilePayload accepts 'role'
        if (userToUpdate.role === 'admin') {
          newRole = 'admin';
        }
        
        const profileUpdatePayload: { role: typeof newRole; isVendor: boolean } = {
          role: newRole,
          isVendor: false,
        };
        
        const userRoleUpdateSuccess = await updateUserProfileRoles(vendorId, profileUpdatePayload);
        if (userRoleUpdateSuccess) {
          toast.success(`User ${userToUpdate.displayName || vendorId}'s role updated.`);
        } else {
          toast.warning(`Vendor deleted, but failed to update user ${userToUpdate.displayName || vendorId}'s role. Please update manually.`);
        }
      } else {
        toast.warning(`Vendor deleted, but user profile for ID ${vendorId} not found to update roles.`);
      }
    } else {
      toast.error(`Failed to delete vendor ${vendorToDelete.name}.`);
    }

    setIsDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  if (error) {
    toast.error(getErrorMessage(error));
    return (
      <div className="flex flex-col justify-center items-center h-full p-4">
        <p className="text-muted-foreground mb-4">Unable to load vendors. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <div className="flex justify-between items-center mb-6">
        {/* Page title moved to Navbar */}
      </div>
      
      <DataTable
        columns={columns}
        data={vendors}
        isLoading={isLoading}
        globalFilterPlaceholder="Search all vendors..."
      />
      <VendorEditModal
        vendor={editingVendor}
        isOpen={isVendorEditModalOpen}
        onClose={handleVendorModalClose}
        onSubmit={handleVendorModalSubmit}
        isUpdating={isUpdatingVendor}
      />
      {vendorToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the vendor profile for 
                "{vendorToDelete.name}" and attempt to revert their user role.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setVendorToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteVendor}>
                Yes, delete vendor
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default AdminVendorsPage;
