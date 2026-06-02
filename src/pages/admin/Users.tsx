import React, { useMemo, useCallback, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { getAdminUserColumns } from './adminUserColumns';
import { useAllUsers } from '@/hooks/useAllUsers';
import type { UserProfile, AdminUpdateUserProfilePayload } from '@/types/userTypes';
import UserEditModal from '@/components/admin/UserEditModal'; // Import the modal
import { toast } from "sonner";
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';

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

  useErrorToast(error, { title: 'Unable to load users' });

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Unable to load users"
        onRetry={() => window.location.reload()}
        retryLabel="Reload Page"
      />
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10 bg-background">
      <div className="rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6">
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No users found."
        globalFilterPlaceholder="Search all users..."
      />
      </div>
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
