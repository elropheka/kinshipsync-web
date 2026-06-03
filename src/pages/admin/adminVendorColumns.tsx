"use client";

import type { ColumnDef } from '@tanstack/react-table';
import type { Vendor } from '@/types/vendorTypes';
import { Button } from '@/components/ui/button';
import { FiStar, FiShoppingBag } from 'react-icons/fi';

export const getAdminVendorColumns = (
  _onToggleFeature: (vendorId: string, currentStatus: boolean) => Promise<void>,
  onEditVendor: (vendor: Vendor) => void,
  _onDeleteVendor: (vendor: Vendor) => void
): ColumnDef<Vendor>[] => [
  {
    id: 'business',
    header: 'Business',
    accessorFn: (v) => v.name,
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
            <FiShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{vendor.name}</p>
            <p className="text-xs text-muted-foreground">{vendor.categoryIds?.[0] || 'General'}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div>
          <p className="text-sm text-foreground">{vendor.name}</p>
          <p className="text-xs text-muted-foreground">{vendor.contactEmail}</p>
        </div>
      );
    },
  },
  {
    id: 'eventsServed',
    header: 'Events Served',
    cell: () => <span className="text-sm text-foreground">—</span>,
  },
  {
    id: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const vendor = row.original;
      if (!vendor.averageRating) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="inline-flex items-center gap-1 text-sm text-foreground">
          <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          {vendor.averageRating}
        </span>
      );
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const vendor = row.original;
      const isPending = !vendor.isFeatured;
      return (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'
          }`}
        >
          {isPending ? 'Pending' : 'Active'}
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
        onClick={() => onEditVendor(row.original)}
      >
        View
      </Button>
    ),
  },
];
