"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Vendor } from "@/types/vendorTypes";
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
import { Badge } from "@/components/ui/badge"; // For 'isFeatured' status

export const getAdminVendorColumns = (
  onToggleFeature: (vendorId: string, currentStatus: boolean) => Promise<void>,
  onEditVendor: (vendor: Vendor) => void,
  onDeleteVendor: (vendor: Vendor) => void, // Added delete handler
  // onApproveVendor: (vendorId: string) => void,
  // onViewDetails: (vendor: Vendor) => void,
): ColumnDef<Vendor>[] => [
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "contactEmail",
    header: "Contact Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => {
      const isFeatured = row.getValue("isFeatured") as boolean;
      return <Badge variant={isFeatured ? "default" : "outline"}>{isFeatured ? "Yes" : "No"}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Registered On <ArrowUpDown className="ml-2 h-4 w-4" />
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
      const vendor = row.original;
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
            <DropdownMenuItem onClick={() => alert(`View details for ${vendor.name}`)}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditVendor(vendor)}>Edit Vendor</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => await onToggleFeature(vendor.id, !!vendor.isFeatured)}>
              {vendor.isFeatured ? "Unfeature" : "Feature"} Vendor
            </DropdownMenuItem>
            {/* Add Approve/Reject if applicable */}
            <DropdownMenuItem 
              onClick={() => onDeleteVendor(vendor)}
              className="text-red-600 hover:!text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-700/30"
            >
              Delete Vendor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
