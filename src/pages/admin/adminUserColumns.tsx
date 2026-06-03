"use client";

import type { ColumnDef } from '@tanstack/react-table';
import type { UserProfile } from '@/types/userTypes';
import { Button } from '@/components/ui/button';

const getDisplayName = (user: UserProfile) => {
  if (user.displayName) return user.displayName;
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  return user.email || user.userId;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const getAdminUserColumns = (
  onEditUser: (user: UserProfile) => void
): ColumnDef<UserProfile>[] => [
  {
    id: 'name',
    header: 'Name',
    accessorFn: (user) => getDisplayName(user),
    cell: ({ row }) => {
      const user = row.original;
      const name = getDisplayName(user);
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center flex-shrink-0">
            {getInitials(name)}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = (row.getValue('role') as string) || 'user';
      return (
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground capitalize">
          {role}
        </span>
      );
    },
  },
  {
    id: 'eventsCreated',
    header: 'Events Created',
    cell: () => <span className="text-sm text-foreground">—</span>,
  },
  {
    id: 'status',
    header: 'Status',
    cell: () => (
      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Active
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string);
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="link"
        className="text-secondary p-0 h-auto font-medium"
        onClick={() => onEditUser(row.original)}
      >
        Edit
      </Button>
    ),
  },
];
