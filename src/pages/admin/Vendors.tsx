import React, { useMemo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiStar } from 'react-icons/fi';
import { DataTable } from '@/components/common/DataTable';
import { getAdminVendorColumns } from './adminVendorColumns';
import { useAllVendors } from '@/hooks/useAllVendors';
import { useAllUsers } from '@/hooks/useAllUsers';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import type { Vendor, UpdateVendorProfilePayload } from '@/types/vendorTypes';
import VendorEditModal from '@/components/admin/VendorEditModal';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboardInputClass } from '@/components/dashboard/DashboardCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminVendorsPage: React.FC = () => {
  const { vendors, isLoading, error, adminUpdateVendorProfile, adminDeleteVendor } = useAllVendors();
  const { users, adminUpdateUserProfile: updateUserProfileRoles } = useAllUsers();
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isVendorEditModalOpen, setIsVendorEditModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdatingVendor, setIsUpdatingVendor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      toast.error('Update function not available.');
      return;
    }
    setIsUpdatingVendor(true);
    const success = await adminUpdateVendorProfile(vendorId, updatedData);
    if (success) {
      toast.success('Vendor profile updated.');
      handleVendorModalClose();
    } else {
      toast.error(getErrorMessage(error) || 'Failed to update vendor profile.');
    }
    setIsUpdatingVendor(false);
  };

  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors;
    const q = searchQuery.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.contactEmail?.toLowerCase().includes(q)
    );
  }, [vendors, searchQuery]);

  const columns = useMemo(
    () =>
      getAdminVendorColumns(handleEditVendor),
    [handleEditVendor]
  );

  const confirmDeleteVendor = async () => {
    if (!vendorToDelete || !adminDeleteVendor || !updateUserProfileRoles) {
      toast.error('Delete operation failed.');
      setIsDeleteDialogOpen(false);
      setVendorToDelete(null);
      return;
    }

    const vendorId = vendorToDelete.id;
    const vendorDeleteSuccess = await adminDeleteVendor(vendorId);

    if (vendorDeleteSuccess) {
      toast.success(`Vendor ${vendorToDelete.name} deleted.`);
      const userToUpdate = users.find((u) => u.userId === vendorId);
      if (userToUpdate) {
        const newRole = userToUpdate.role === 'admin' ? 'admin' : 'organizer';
        await updateUserProfileRoles(vendorId, { role: newRole, isVendor: false });
      }
    } else {
      toast.error(`Failed to delete vendor ${vendorToDelete.name}.`);
    }

    setIsDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  useErrorToast(error, { title: 'Unable to load vendors' });

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Unable to load vendors"
        onRetry={() => window.location.reload()}
        retryLabel="Reload Page"
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-1">Vendor Management</h1>
          <p className="text-muted-foreground text-sm">{vendors.length} registered vendors</p>
        </div>
        <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 self-start">
          <Link to="/dashboard/admin/register-vendor">
            <FiShoppingBag className="w-4 h-4" />
            Register Vendor
          </Link>
        </Button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-10 rounded-full ${dashboardInputClass}`}
        />
      </div>

      <DashboardCard className="overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredVendors}
          isLoading={isLoading}
          emptyMessage="No vendors found."
          renderMobileCard={(vendor: Vendor) => {
            const isPending = !vendor.isFeatured;
            return (
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                      <FiShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.categoryIds?.[0] || 'General'}</p>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-secondary p-0 h-auto font-medium text-sm shrink-0"
                    onClick={() => handleEditVendor(vendor)}
                  >
                    View
                  </Button>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {vendor.contactEmail && <p>{vendor.contactEmail}</p>}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {vendor.averageRating && (
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      {vendor.averageRating}
                    </span>
                  )}
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'
                  }`}>
                    {isPending ? 'Pending' : 'Active'}
                  </span>
                </div>
              </div>
            );
          }}
        />
      </DashboardCard>

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
                This will permanently delete the vendor profile for &ldquo;{vendorToDelete.name}&rdquo;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setVendorToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteVendor}>Yes, delete vendor</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default AdminVendorsPage;
