import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/hooks/useAppTheme'; // Corrected import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { firestore } from '@/services/firebaseConfig'; // For Firestore access
import { collection, query, where, getDocs, limit } from 'firebase/firestore'; // Re-added 'where'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell,  Search, ChevronDown, User, Settings, LogOut, Sun, Moon } from 'lucide-react'; // Added Sun and Moon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from '@/services/firebaseConfig'; // For logout
import { signOut as firebaseSignOut } from 'firebase/auth'; // For logout
import { RiMenuFold3Line as DoorClosed, RiMenuFold4Line as DoorOpen } from "react-icons/ri";

interface SearchResultItem {
  id: string;
  type: 'user' | 'event' | 'vendor';
  name: string;
  description?: string;
  path: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onProfileDropdownToggle?: (isOpen: boolean) => void;
  onToggleNotificationDrawer: () => void;
  isNotificationDrawerOpen: boolean;
  unreadCount?: number; // Added unreadCount
}

const Navbar = forwardRef<HTMLButtonElement, NavbarProps>(
  (
    props: NavbarProps, // Explicitly type props here
    ref: React.Ref<HTMLButtonElement> // Explicitly type ref here
  ) => {
    const {
      onToggleSidebar,
      isSidebarOpen,
      onProfileDropdownToggle,
      onToggleNotificationDrawer,
      // isNotificationDrawerOpen,
    } = props;

    const { currentUser, userProfile, isAdmin, isVendor } = useAuth();
  const { themeMode, toggleTheme } = useAppTheme(); // Get theme context
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  // Debounce search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsResultsVisible(false);
      return;
    }

    setIsResultsVisible(true);
    setIsSearchLoading(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const results: SearchResultItem[] = [];
        const lowerCaseSearchQuery = searchQuery.toLowerCase();

        // Users search
        const usersCol = collection(firestore, 'users');
        const userQueries = [
          query(usersCol, where('displayName_lowercase', '>=', lowerCaseSearchQuery), where('displayName_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'), limit(5)),
          query(usersCol, where('firstName_lowercase', '>=', lowerCaseSearchQuery), where('firstName_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'), limit(5)),
          query(usersCol, where('lastName_lowercase', '>=', lowerCaseSearchQuery), where('lastName_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'), limit(5))
        ];

        const userSnapshots = await Promise.all(userQueries.map(q => getDocs(q)));
        
        userSnapshots.forEach(userSnap => {
          userSnap.forEach(doc => {
            const data = doc.data();
            // Add to results, ensuring no duplicates based on id
            if (!results.some(r => r.id === doc.id && r.type === 'user')) {
              results.push({
                id: doc.id,
                type: 'user',
                name: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown User',
                description: data.email,
                path: `/user/user-detail/${doc.id}`
              });
            }
          });
        });
        
        // Events search: Case-insensitive prefix match on 'name_lowercase' (corrected from title)
        const eventsCol = collection(firestore, 'events');
        const eventQuery = query(eventsCol, 
                                 where('name_lowercase', '>=', lowerCaseSearchQuery), 
                                 where('name_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'), 
                                 limit(10));
        const eventSnap = await getDocs(eventQuery);
        eventSnap.forEach(doc => {
          const data = doc.data();
          results.push({
            id: doc.id,
            type: 'event',
            name: data.name || 'Unnamed Event', // Display original casing
            description: data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : undefined,
            path: `/user/event-detail/${doc.id}`
          });
        });
        
        // Vendors search: Case-insensitive prefix match on 'name_lowercase' (corrected from businessName)
        const vendorsCol = collection(firestore, 'vendors');
        const vendorQuery = query(vendorsCol, 
                                  where('name_lowercase', '>=', lowerCaseSearchQuery), 
                                  where('name_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'), 
                                  limit(10));
        const vendorSnap = await getDocs(vendorQuery);
        vendorSnap.forEach(doc => {
          const data = doc.data();
          results.push({
            id: doc.id,
            type: 'vendor',
            name: data.name || 'Unnamed Vendor', // Display original casing
            description: data.category, 
            path: `/user/vendor-detail/${doc.id}`
          });
        });
        
        const finalFilteredResults = results; // Results are already filtered by Firestore prefix query.
        
        // Deduplicate results
        const uniqueResults = Array.from(new Map(finalFilteredResults.map(item => [item.id + item.type, item])).values());

        setSearchResults(uniqueResults.slice(0, 10)); // Limit final display to 10 results
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]); // Clear results on error
      } finally {
        setIsSearchLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Click outside search results to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


    const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      navigate('/auth'); // Redirect to auth page after logout
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error (e.g., display a notification)
    }
  };

  // Define page titles based on path
  const getPageTitle = (pathname: string): string => {
    // Exact matches first
    const titles: Record<string, string> = {
      '/dashboard/admin/': 'Admin Dashboard',
      '/dashboard/admin/users': 'Manage Users',
      '/dashboard/admin/vendors': 'Manage Vendors',
      '/dashboard/admin/events': 'Manage Events',
      '/dashboard/admin/register-vendor': 'Register Vendor',
      '/dashboard/admin/create-vendor-category': 'Create Vendor Category',
      '/dashboard/admin/create-theme': 'Create Theme',
      '/dashboard/vendor/dashboard': 'Vendor Dashboard',
      '/dashboard/vendor/items': 'My Items/Services',
      '/dashboard/vendor/profile': 'Vendor Profile',
      '/dashboard/user': 'My Events',
      '/dashboard/user/profile': 'My Profile',
      // Add more specific paths here
    };
    if (titles[pathname]) {
      return titles[pathname];
    }
    // Fallback for parameterized routes or general sections
    if (pathname.startsWith('/dashboard/admin')) return 'Admin Panel';
    if (pathname.startsWith('/dasboard/vendor')) return 'Vendor Portal';
    if (pathname.startsWith('/dashboard/user')) return 'User Space';
    return 'KinshipSync'; // Default title
  };

  const pageTitle = getPageTitle(location.pathname);

  const getAvatarFallback = (name?: string | null) => {
    if (name) {
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('');
      return initials.toUpperCase() || 'U';
    }
    return 'U';
  };

    return (
              <header className="h-16 flex items-center px-4 sm:px-6 bg-background border-b border-border sticky top-0 z-10">
        {/* Left section: Toggle Button and Page Title */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2" title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
            {isSidebarOpen ? <DoorClosed className="h-6 w-6" /> : <DoorOpen className="h-6 w-6" />}
          </Button>
                      <h1 className="text-xl font-semibold text-foreground hidden sm:block">
            {pageTitle}
          </h1>
        </div>

      {/* Center section: Search Bar */}
      <div className="flex-1 flex justify-center px-4" ref={searchContainerRef}>
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search users, events, vendors..."
                          className="block w-full pl-10 pr-3 py-2 rounded-full border border-border focus:outline-none focus:ring-primary focus:border-primary text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsResultsVisible(true)}
            // onBlur is handled by click outside now
          />
          {isResultsVisible && searchQuery && (
            <div className="absolute mt-1 w-full max-h-80 overflow-y-auto bg-background border border-border rounded-md shadow-lg z-20">
              {isSearchLoading && <div className="p-3 text-sm text-muted-foreground">Searching...</div>}
              {!isSearchLoading && searchResults.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">No results found for "{searchQuery}"</div>
              )}
              {!isSearchLoading && searchResults.map((item) => (
                <Link
                  to={item.path}
                  key={item.id + item.type}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                  onClick={() => {
                    setIsResultsVisible(false);
                    setSearchQuery(''); // Clear search query after click
                  }}
                >
                  <div className="font-medium">{item.name} <span className="text-xs text-muted-foreground">({item.type})</span></div>
                  {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Greeting, Notifications and User Dropdown Menu */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          {currentUser && (
            <span className="text-sm text-foreground hidden sm:inline">
              Hi, {userProfile?.firstName || currentUser.displayName?.split(' ')[0] || 'User'}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="mr-2" // Added some margin for spacing
          >
            {themeMode === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </Button>
          <Button ref={ref} variant="ghost" size="icon" title="Notifications" onClick={onToggleNotificationDrawer} className="relative">
            <Bell className="h-6 w-6" />
            {props.unreadCount && props.unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-3 w-3 rounded-full ring-2 ring-background bg-destructive" />
            )}
          </Button>

          {currentUser && (
            <DropdownMenu onOpenChange={onProfileDropdownToggle}> {/* Call onProfileDropdownToggle on open/close */}
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 p-1 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 h-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(userProfile?.avatarUrl || currentUser?.photoURL) ?? undefined} alt={currentUser.displayName || 'User'} />
                    <AvatarFallback>{getAvatarFallback(currentUser.displayName)}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 opacity-70 mr-1" /> {/* Added small margin to right if button is pill shaped */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile?.displayName || currentUser.displayName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  if (isVendor) navigate('/dashboard/vendor/profile');
                  else if (isAdmin) navigate('/dashboard/admin'); // Or a future admin profile page
                  else navigate('/dashboard/user/profile'); // Fallback for general user
                }}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}> {/* Placeholder for settings page */}
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {/* NotificationDrawer is now rendered in MainLayout */}
      </header>
    );
  }
);

export default Navbar;
