import React, { useMemo, useCallback, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { getAdminUserColumns } from './adminUserColumns';
import { useAllUsers } from '@/hooks/useAllUsers';
import type { UserProfile, AdminUpdateUserProfilePayload } from '@/types/userTypes';
import UserEditModal from '@/components/admin/UserEditModal'; // Import the modal
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";

const AdminUsersPage: React.FC = () => {
  const { users, isLoading, error, adminUpdateUserProfile, fetchAllUsers } = useAllUsers();
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const handleEditUser = useCallback((user: UserProfile) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  }, []);

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSubmit = async (userId: string, updatedData: AdminUpdateUserProfilePayload) => {
    if (!adminUpdateUserProfile) {
      toast.error("Update function not available.");
      return;
    }
    setIsUpdatingUser(true);
    const success = await adminUpdateUserProfile(userId, updatedData);
    if (success) {
      toast.success("User profile updated.");
      handleModalClose();
      fetchAllUsers(); // Refetch users to show updated data
    } else {
      toast.error("Failed to update user profile.");
    }
    setIsUpdatingUser(false);
  };

  const columns = useMemo(() => {
    return getAdminUserColumns(handleEditUser);
  }, [handleEditUser]);

  if (error) {
    toast.error(getErrorMessage(error));
    return (
      <div className="flex flex-col justify-center items-center h-full p-4">
        <p className="text-muted-foreground mb-4">Unable to load users. Please try again.</p>
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
        data={users}
        isLoading={isLoading}
        globalFilterPlaceholder="Search all users..."
      />
      <UserEditModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        isUpdating={isUpdatingUser}
      />
    </div>
  );
};

export default AdminUsersPage;
