import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { firestore } from '@/services/firebaseConfig';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, ChevronDown, User, Settings, LogOut, Sun, Moon, Plus } from 'lucide-react';
import tealLogoOnly from '@/assets/branding/teal-logo-only.png';
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
        const usersCol = collection(firestore, 'profiles');
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
                path: `/dashboard/users/${doc.id}`
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
      '/dashboard/events': 'Events',
      '/dashboard/admin': 'Admin Dashboard',
      '/dashboard/admin/': 'Admin Dashboard',
      '/dashboard/admin/users': 'Manage Users',
      '/dashboard/admin/vendors': 'Manage Vendors',
      '/dashboard/admin/events': 'Manage Events',
      '/dashboard/admin/register-vendor': 'Register Vendor',
      '/dashboard/admin/create-vendor-category': 'Create Vendor Category',
      '/dashboard/admin/create-theme': 'Create Theme',
      '/dashboard/vendor': 'Vendor Dashboard',
      '/dashboard/vendor/': 'Vendor Dashboard',
      '/dashboard/vendor/items': 'My Items/Services',
      '/dashboard/vendor/profile': 'Vendor Profile',
      '/dashboard/vendor/events': 'My Events',
      '/dashboard/user': 'My Events',
      '/dashboard/user/profile': 'My Profile',
      '/dashboard/settings': 'Settings',
      '/dashboard/user/delete-my-account': 'Delete Account',
    };
    if (titles[pathname]) {
      return titles[pathname];
    }
    // Fallback for parameterized routes or general sections
    if (pathname.startsWith('/dashboard/admin')) return 'Admin Panel';
    if (pathname.startsWith('/dashboard/vendor')) return 'Vendor Portal';
    if (pathname.startsWith('/dashboard/users/')) return 'User details';
    if (pathname.startsWith('/dashboard/user')) return 'User Space';
    if (pathname.startsWith('/dashboard/events')) return 'Events';
    return '';
  };

  const pageTitle = getPageTitle(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');
  const isUserAppRoute =
    !isAdminRoute &&
    !location.pathname.startsWith('/dashboard/vendor') &&
    !location.pathname.startsWith('/dashboard/settings');

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
              <header className="h-16 flex items-center px-4 sm:px-6 bg-white border-b border-[#D6C8AF]/30 sticky top-0 z-10">
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-[#5D2413] hover:bg-[#F5EFE8]" title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            {isSidebarOpen ? <DoorClosed className="h-6 w-6" /> : <DoorOpen className="h-6 w-6" />}
          </Button>
          {isUserAppRoute ? (
            <Link to="/dashboard/events" className="flex-shrink-0">
              <img src={tealLogoOnly} alt="Kinship Sync" className="h-8 w-8 object-contain" />
            </Link>
          ) : pageTitle && !isAdminRoute ? (
            <h1 className="text-xl font-semibold text-[#5D2413] truncate hidden sm:block">{pageTitle}</h1>
          ) : null}
        </div>

      {isAdminRoute ? (
      <div className="flex-1 flex justify-center px-4" ref={searchContainerRef}>
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search users, events, vendors..."
                          className="block w-full pl-10 pr-3 py-2 rounded-full border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm sm:text-base"
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
      ) : (
        <div className="flex-1" />
      )}

      {/* Right section */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          {isUserAppRoute && (
            <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90 text-white h-9 px-4 hidden sm:inline-flex">
              <Link to="/dashboard/events/create">
                <Plus className="w-4 h-4 mr-1" />
                New Event
              </Link>
            </Button>
          )}

          <Button ref={ref} variant="ghost" size="icon" title="Notifications" onClick={onToggleNotificationDrawer} className="relative text-[#5D2413]">
            <Bell className="h-6 w-6" />
            {props.unreadCount && props.unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-secondary ring-2 ring-white" />
            )}
          </Button>

          {!isUserAppRoute && currentUser && (
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
                  if (isVendor && !isAdmin) {
                    navigate('/dashboard/vendor/profile');
                  } else {
                    navigate('/dashboard/user/profile');
                  }
                }}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {themeMode === 'light' ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  <span>{themeMode === 'light' ? 'Dark mode' : 'Light mode'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isUserAppRoute && currentUser && (
            <DropdownMenu onOpenChange={onProfileDropdownToggle}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center p-1 rounded-full h-auto sm:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(userProfile?.avatarUrl || currentUser?.photoURL) ?? undefined} alt={currentUser.displayName || 'User'} />
                    <AvatarFallback>{getAvatarFallback(currentUser.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate('/dashboard/user/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
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
