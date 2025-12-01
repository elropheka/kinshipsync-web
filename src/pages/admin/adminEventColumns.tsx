"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Event } from "@/types/eventTypes";
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
import { Badge } from "@/components/ui/badge";

// Helper function to determine event status based on dates
export const getEventStatus = (eventDate: string, eventEndDate?: string): Event['status'] => {
  const now = new Date();
  const startDate = new Date(eventDate);
  const endDate = eventEndDate ? new Date(eventEndDate) : startDate; // If no endDate, it's a single-day event

  // Adjust endDate to be end of the day for comparison
  endDate.setHours(23, 59, 59, 999);

  if (now > endDate) {
    return 'completed';
  } else if (now >= startDate && now <= endDate) {
    return 'ongoing';
  } else {
    return 'upcoming';
  }
  // 'cancelled' status would likely be an explicit field in the Event data, not calculated here.
};


export const getAdminEventColumns = (
  userMap: Record<string, string> = {}, // Add userMap parameter with a default empty object
  onEditEvent: (event: Event) => void, // Uncommented/Added
  onViewEvent: (event: Event) => void, // Added for viewing event details
  onDeleteEvent: (eventId: string) => void,
): ColumnDef<Event>[] => [
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
        Event Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const event = row.original;
      // Use explicit status if available, otherwise calculate it
      const status = event.status || getEventStatus(event.date, event.endDate);
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (status === 'ongoing') badgeVariant = 'default'; // e.g., primary color
      else if (status === 'completed') badgeVariant = 'secondary';
      else if (status === 'upcoming') badgeVariant = 'outline'; // Or another color
      else if (status === 'cancelled') badgeVariant = 'destructive';
      
      return <Badge variant={badgeVariant} className="capitalize">{status}</Badge>;
    },
  },
  {
    // accessorKey: "organizerId", // We'll use a custom cell renderer
    header: "Organizer",
    cell: ({ row }) => {
      const organizerId = row.original.organizerId;
      return userMap[organizerId] || organizerId; // Display name or ID if not found
    },
    // Optional: Add sorting by organizer name if data is pre-processed or accessorFn is used
    // sortingFn: (rowA, rowB, columnId) => {
    //   const nameA = userMap[rowA.original.organizerId] || '';
    //   const nameB = userMap[rowB.original.organizerId] || '';
    //   return nameA.localeCompare(nameB);
    // },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
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
            <DropdownMenuItem onClick={() => onViewEvent(event)}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditEvent(event)}>Edit Event</DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => alert(`Change status for ${event.name}`)}>Change Status</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 hover:!text-red-600"
              onClick={() => onDeleteEvent(event.id)}
            >
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
