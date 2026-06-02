import React, { useMemo, useCallback, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { DataTable } from '@/components/common/DataTable';
import { getAdminUserColumns } from './adminUserColumns';
import { useAllUsers } from '@/hooks/useAllUsers';
import type { UserProfile, AdminUpdateUserProfilePayload } from '@/types/userTypes';
import UserEditModal from '@/components/admin/UserEditModal';
import { toast } from 'sonner';
import { useErrorToast } from '@/hooks/useErrorToast';
import { ErrorState } from '@/components/common/ErrorState';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboardInputClass } from '@/components/dashboard/DashboardCard';

type RoleFilter = 'all' | 'organizer' | 'member';

const AdminUsersPage: React.FC = () => {
  const { users, isLoading, error, adminUpdateUserProfile, fetchAllUsers } = useAllUsers();
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

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
      toast.error('Update function not available.');
      return;
    }
    setIsUpdatingUser(true);
    const success = await adminUpdateUserProfile(userId, updatedData);
    if (success) {
      toast.success('User profile updated.');
      handleModalClose();
      fetchAllUsers();
    } else {
      toast.error('Failed to update user profile.');
    }
    setIsUpdatingUser(false);
  };

  const filteredUsers = useMemo(() => {
    let result = users;
    if (roleFilter === 'organizer') {
      result = result.filter((u) => u.role === 'organizer' || u.role === 'admin');
    } else if (roleFilter === 'member') {
      result = result.filter((u) => u.role === 'member' || u.role === 'vendor');
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          u.displayName?.toLowerCase().includes(q) ||
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, roleFilter, searchQuery]);

  const columns = useMemo(() => getAdminUserColumns(handleEditUser), [handleEditUser]);

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

  const filterButtons: { key: RoleFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'organizer', label: 'Organizers' },
    { key: 'member', label: 'Users' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#5D2413] mb-1">User Management</h1>
          <p className="text-muted-foreground text-sm">{users.length} total users</p>
        </div>
        <Button className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 self-start">
          <FiPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 rounded-full ${dashboardInputClass}`}
          />
        </div>
        <div className="flex gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setRoleFilter(btn.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                roleFilter === btn.key
                  ? 'bg-primary text-white'
                  : 'bg-white text-[#5D2413] border border-[#D6C8AF]/50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <DashboardCard className="overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          emptyMessage="No users found."
        />
      </DashboardCard>

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
