"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { UserProfile } from "@/types/userTypes";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"; // For roles

export const getAdminUserColumns = (
  onEditUser: (user: UserProfile) => void, // Uncommented
  // onDeleteUser: (userId: string) => void,
  // onChangeRole: (userId: string, newRole: UserProfile['role']) => void,
): ColumnDef<UserProfile>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name", // Added id
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (user) => { // Added accessorFn
      let nameToDisplay = user.displayName;
      if (!nameToDisplay && (user.firstName || user.lastName)) {
        nameToDisplay = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      }
      return nameToDisplay || user.userId;
    },
    cell: ({ row }) => {
      // The accessorFn now provides the value, or we can re-calculate for display consistency
      const user = row.original;
      let nameToDisplay = user.displayName;
      if (!nameToDisplay && (user.firstName || user.lastName)) {
        nameToDisplay = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      }
      return <div className="font-medium">{nameToDisplay || user.userId}</div>;
    },
    sortingFn: (rowA, rowB) => { // Removed columnId
      // Value from accessorFn is available via row.getValue("name")
      const nameA = rowA.getValue("name") as string;
      const nameB = rowB.getValue("name") as string;
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserProfile['role'];
      if (!role) {
        return <span className="text-muted-foreground">N/A</span>;
      }
      return (
        <div className="flex space-x-1">
          <Badge variant="secondary">{role}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Joined Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => alert(`View details for ${user.displayName}`)}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditUser(user)}>Edit User</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Change role for ${user.displayName}`)}>Change Role</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 hover:!text-red-600">Delete User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
