import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Briefcase,
  CalendarDays,
  UserPlus,
  Activity,
  Server,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { useAllUsers } from '@/hooks/useAllUsers';
import { useAllVendors } from '@/hooks/useAllVendors';
import { useAllEvents } from '@/hooks/useAllEvents';

const brandCardClass = 'rounded-xl border border-border bg-card shadow-sm';

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

  const userCount = isLoadingUsers ? "..." : usersError ? "Error" : users.length;
  const vendorCount = isLoadingVendors ? "..." : vendorsError ? "Error" : vendors.length;
  const eventCount = isLoadingEvents ? "..." : eventsError ? "Error" : allEvents.length;

  const newUsersLast30Days = isLoadingUsers ? "..." : usersError ? "Error" : getNewCountsLast30Days(users);
  const newVendorsLast30Days = isLoadingVendors ? "..." : vendorsError ? "Error" : getNewCountsLast30Days(vendors);
  const newEventsLast30Days = isLoadingEvents ? "..." : eventsError ? "Error" : getNewCountsLast30Days(allEvents);

  const topEvents = useMemo(() => {
    if (!allEvents?.length) return [];
    return [...allEvents]
      .sort((a, b) => (b.totalAttendees ?? 0) - (a.totalAttendees ?? 0))
      .slice(0, 5);
  }, [allEvents]);

  const systemHealthy = !usersError && !vendorsError && !eventsError && !isLoading;

  if (isLoading && (userCount === "..." || vendorCount === "..." || eventCount === "...")) {
    return (
      <div className="p-4 text-center bg-background text-muted-foreground">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10 space-y-8 bg-background">
      <p className="text-lg text-muted-foreground">
        Overview of the platform and quick access to management sections.
      </p>

      {/* KPI cards */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Platform Totals</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className={brandCardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Users</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{userCount}</div>
              <Link to="/dashboard/admin/users" className="text-xs text-primary hover:underline">
                View all users
              </Link>
            </CardContent>
          </Card>
          <Card className={brandCardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Vendors</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{vendorCount}</div>
              <Link to="/dashboard/admin/vendors" className="text-xs text-primary hover:underline">
                View all vendors
              </Link>
            </CardContent>
          </Card>
          <Card className={brandCardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Events</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-secondary/15 flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{eventCount}</div>
              <Link to="/dashboard/admin/events" className="text-xs text-primary hover:underline">
                View all events
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity (last 30 days) */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Activity (Last 30 Days)</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className={brandCardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">New Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{newUsersLast30Days}</div>
              <p className="text-xs text-muted-foreground">Registered in the last 30 days</p>
            </CardContent>
          </Card>
          <Card className={brandCardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">New Vendors</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{newVendorsLast30Days}</div>
              <p className="text-xs text-muted-foreground">Joined in the last 30 days</p>
            </CardContent>
          </Card>
          <Card className={brandCardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">New Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{newEventsLast30Days}</div>
              <p className="text-xs text-muted-foreground">Created in the last 30 days</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top events */}
        <Card className={brandCardClass}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Top Events
            </CardTitle>
            <CardDescription>By reported attendee count</CardDescription>
          </CardHeader>
          <CardContent>
            {topEvents.length > 0 ? (
              <ul className="space-y-3">
                {topEvents.map((event, index) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-semibold text-primary w-6">#{index + 1}</span>
                      <span className="font-medium text-foreground truncate">{event.name}</span>
                    </div>
                    <Badge variant="secondary">{event.totalAttendees ?? 0} guests</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No events to rank yet.</p>
            )}
          </CardContent>
        </Card>

        {/* System health */}
        <Card className={brandCardClass}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              System Health
            </CardTitle>
            <CardDescription>Data layer status for admin modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <Users className="h-4 w-4 text-primary" />
                Users API
              </span>
              <Badge variant={usersError ? 'destructive' : isLoadingUsers ? 'outline' : 'default'}>
                {usersError ? 'Error' : isLoadingUsers ? 'Loading' : 'Healthy'}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                Vendors API
              </span>
              <Badge variant={vendorsError ? 'destructive' : isLoadingVendors ? 'outline' : 'default'}>
                {vendorsError ? 'Error' : isLoadingVendors ? 'Loading' : 'Healthy'}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <Database className="h-4 w-4 text-primary" />
                Events API
              </span>
              <Badge variant={eventsError ? 'destructive' : isLoadingEvents ? 'outline' : 'default'}>
                {eventsError ? 'Error' : isLoadingEvents ? 'Loading' : 'Healthy'}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 mt-2">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Overall
              </span>
              <Badge variant={systemHealthy ? 'default' : 'destructive'}>
                {systemHealthy ? 'All systems operational' : 'Needs attention'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Management Sections</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/dashboard/admin/users"
            className={`block p-6 ${brandCardClass} hover:shadow-md transition-shadow group`}
          >
            <Users className="h-8 w-8 mb-2 text-primary group-hover:scale-105 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground">User Management</h3>
            <p className="text-sm text-muted-foreground">View and manage user profiles.</p>
          </Link>
          <Link
            to="/dashboard/admin/vendors"
            className={`block p-6 ${brandCardClass} hover:shadow-md transition-shadow group`}
          >
            <Briefcase className="h-8 w-8 mb-2 text-primary group-hover:scale-105 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground">Vendor Management</h3>
            <p className="text-sm text-muted-foreground">View and manage vendor listings.</p>
          </Link>
          <Link
            to="/dashboard/admin/events"
            className={`block p-6 ${brandCardClass} hover:shadow-md transition-shadow group`}
          >
            <CalendarDays className="h-8 w-8 mb-2 text-secondary group-hover:scale-105 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground">Event Management</h3>
            <p className="text-sm text-muted-foreground">Oversee all platform events.</p>
          </Link>
          <Link
            to="/dashboard/admin/register-vendor"
            className={`block p-6 ${brandCardClass} hover:shadow-md transition-shadow group`}
          >
            <UserPlus className="h-8 w-8 mb-2 text-secondary group-hover:scale-105 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground">Register Vendor</h3>
            <p className="text-sm text-muted-foreground">Add new vendors to the platform.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
