import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { useVendorProfile } from '@/hooks/useVendorProfile'; // To get profile name
import { useVendorItems } from '@/hooks/useVendorItems'; // Import useVendorItems
import type { Vendor } from '@/types/vendorTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListPlus, UserCog, BarChart3, Calendar } from 'lucide-react';

const VendorDashboard: React.FC = () => {
  const { profile, isLoading: isLoadingProfile, error: profileError } = useVendorProfile();
  const { items: vendorItems, isLoading: isLoadingItems, error: itemsError } = useVendorItems();

  const profileCompletionPercentage = useMemo(() => {
    if (!profile) return 0;

    const keysForCompletion: (keyof Vendor)[] = [
      'name', 'description', 'categoryIds', 'contactEmail', 'phoneNumber',
      'websiteUrl', 'address', 'logoUrl',
      'servicesOffered', 'pricingInfo', 'operatingHours'
    ];

    let completedFields = 0;

    keysForCompletion.forEach(key => {
      const value = profile[key];

      if (key === 'categoryIds' || key === 'servicesOffered') {
        // These are string[] | undefined
        if (Array.isArray(value) && value.length > 0) {
          completedFields++;
        }
      } else if (key === 'address') {
        // This is Vendor['address'] (object | undefined)
        if (value != null && typeof value === 'object' && Object.values(value).some(subVal => !!subVal && String(subVal).trim() !== '')) {
          completedFields++;
        }
      } else {
        // Default check for other types (string, string | undefined, etc.)
        // This includes 'name', 'description' which are string
        // and optional fields like 'contactEmail', 'phoneNumber', etc. which are string | undefined
        if (value && String(value).trim() !== '') {
          completedFields++;
        }
      }
    });

    return Math.round((completedFields / keysForCompletion.length) * 100);
  }, [profile]);

  const isLoading = isLoadingProfile || isLoadingItems;
  const totalItemsCount = isLoadingItems ? "..." : itemsError ? "Error" : vendorItems.length;

  if (isLoading && !profile && !vendorItems.length) { // Show general loading if primary data isn't there yet
    return <div className="p-4 text-center">Loading dashboard data...</div>;
  }

  // Handle individual errors if needed, or a general error display
  if (profileError) {
    toast.error(getErrorMessage(profileError));
    return (
      <div className="flex flex-col justify-center items-center h-full p-4">
        <p className="text-muted-foreground mb-4">Unable to load profile. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }
  // if (itemsError) { // Optionally display item loading error specifically
  //   return <div className="p-4 text-red-500">Error loading items: {itemsError.message}</div>;
  // }


  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10 space-y-8">
      {/* <h1 className="text-4xl font-bold">Vendor Dashboard</h1> Page title moved to Navbar */}
      {/* Greeting removed, will be in Navbar */}
              <p className="text-lg text-muted-foreground">
        This is your dashboard. Manage your services, profile, and view your performance.
      </p>

      {/* Quick Stats - Placeholder */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items/Services</CardTitle>
            <ListPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsCount}</div>
            <p className="text-xs text-muted-foreground">Number of active listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletionPercentage}%</div>
            <p className="text-xs text-muted-foreground">Keep your profile up-to-date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views (Example)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">Views in the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link to="/dashboard/vendor/items">
              <ListPlus className="mr-2 h-5 w-5" /> Manage Items/Services
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard/vendor/profile">
              <UserCog className="mr-2 h-5 w-5" /> Edit Profile
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard/vendor/events">
              <Calendar className="mr-2 h-5 w-5" /> Manage Events
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Placeholder for recent activity or notifications */}
      {/* 
      <div>
        <h2 className="text-2xl font-semibold">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No recent activity to display.</p>
          </CardContent>
        </Card>
      </div>
      */}
    </div>
  );
};

export default VendorDashboard;
