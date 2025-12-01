import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, CalendarDays, UserPlus, Activity } from 'lucide-react';
import { useAllUsers } from '@/hooks/useAllUsers';
import { useAllVendors } from '@/hooks/useAllVendors';
import { useAllEvents } from '@/hooks/useAllEvents';

// Helper function to count items created in the last 30 days
const getNewCountsLast30Days = (items: Array<{ createdAt: string } | undefined>): number => {
  if (!items) return 0;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return items.filter(item => {
    if (!item || !item.createdAt) return false;
    const itemDate = new Date(item.createdAt);
    return itemDate >= thirtyDaysAgo;
  }).length;
};

const AdminDashboard: React.FC = () => {
  const { users, isLoading: isLoadingUsers, error: usersError } = useAllUsers();
  const { vendors, isLoading: isLoadingVendors, error: vendorsError } = useAllVendors();
  const { allEvents, isLoading: isLoadingEvents, error: eventsError } = useAllEvents();

  const isLoading = isLoadingUsers || isLoadingVendors || isLoadingEvents;

  // Display loading or error states for counts
  const userCount = isLoadingUsers ? "..." : usersError ? "Error" : users.length;
  const vendorCount = isLoadingVendors ? "..." : vendorsError ? "Error" : vendors.length;
  const eventCount = isLoadingEvents ? "..." : eventsError ? "Error" : allEvents.length;

  // Calculate new counts for the last 30 days
  const newUsersLast30Days = isLoadingUsers ? "..." : usersError ? "Error" : getNewCountsLast30Days(users);
  const newVendorsLast30Days = isLoadingVendors ? "..." : vendorsError ? "Error" : getNewCountsLast30Days(vendors);
  const newEventsLast30Days = isLoadingEvents ? "..." : eventsError ? "Error" : getNewCountsLast30Days(allEvents);
  
  if (isLoading && (userCount === "..." || vendorCount === "..." || eventCount === "...")) {
    // Show a general loading state if any of the counts are still loading initially
    return <div className="p-4 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10 space-y-8">
      {/* <h1 className="text-4xl font-bold">Admin Dashboard</h1> Page title moved to Navbar */}
      {/* Greeting removed, will be in Navbar */}
    
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
        Overview of the platform and quick access to management sections.
      </p>

      {/* Summary Stats Cards - Totals */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Platform Totals</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
              <Link to="/dashboard/admin/users" className="text-xs text-muted-foreground hover:underline">View all users</Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorCount}</div>
              <Link to="/dashboard/admin/vendors" className="text-xs text-muted-foreground hover:underline">View all vendors</Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventCount}</div>
              <Link to="/dashboard/admin/events" className="text-xs text-muted-foreground hover:underline">View all events</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Trends Cards - Last 30 Days */}
      <div>
        <h2 className="text-2xl font-semibold my-4">Activity (Last 30 Days)</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newUsersLast30Days}</div>
              <p className="text-xs text-muted-foreground">Registered in the last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Vendors</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newVendorsLast30Days}</div>
              <p className="text-xs text-muted-foreground">Joined in the last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newEventsLast30Days}</div>
              <p className="text-xs text-muted-foreground">Created in the last 30 days</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Quick Links/Actions */}
      <div>
        <h2 className="text-2xl font-semibold my-4">Management Sections</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/dashboard/admin/users" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
            <Users className="h-8 w-8 mb-2 text-teal-600" />
            <h3 className="text-lg font-semibold">User Management</h3>
            <p className="text-sm text-muted-foreground">View and manage user profiles.</p>
          </Link>
          <Link to="/dashboard/admin/vendors" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
            <Briefcase className="h-8 w-8 mb-2 text-teal-600" />
            <h3 className="text-lg font-semibold">Vendor Management</h3>
            <p className="text-sm text-muted-foreground">View and manage vendor listings.</p>
          </Link>
          <Link to="/dashboard/admin/events" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
            <CalendarDays className="h-8 w-8 mb-2 text-teal-600" />
            <h3 className="text-lg font-semibold">Event Management</h3>
            <p className="text-sm text-muted-foreground">Oversee all platform events.</p>
          </Link>
          <Link to="/dashboard/admin/register-vendor" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
            <UserPlus className="h-8 w-8 mb-2 text-teal-600" />
            <h3 className="text-lg font-semibold">Register Vendor</h3>
            <p className="text-sm text-muted-foreground">Add new vendors to the platform.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
