import { forwardRef, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { firestore } from '@/services/firebaseConfig';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiMenu, FiBell, FiPlus, FiSearch } from 'react-icons/fi';
import { ChevronDown, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import tealTextLogo from '@/assets/branding/teal-text-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/services/firebaseConfig';
import { signOut as firebaseSignOut } from 'firebase/auth';

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
  unreadCount?: number;
}

const Navbar = forwardRef<HTMLButtonElement, NavbarProps>((props, ref) => {
  const {
    onToggleSidebar,
    onProfileDropdownToggle,
    onToggleNotificationDrawer,
  } = props;

  const { currentUser, userProfile, isAdmin, isVendor } = useAuth();
  const { themeMode, toggleTheme } = useAppTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');
  const isUserAppRoute =
    !isAdminRoute &&
    !location.pathname.startsWith('/dashboard/vendor') &&
    !location.pathname.startsWith('/dashboard/settings');

  useEffect(() => {
    if (!isAdminRoute || searchQuery.trim() === '') {
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

        const usersCol = collection(firestore, 'profiles');
        const userQueries = [
          query(usersCol, where('displayName_lowercase', '>=', lowerCaseSearchQuery), where('displayName_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'), limit(5)),
          query(usersCol, where('firstName_lowercase', '>=', lowerCaseSearchQuery), where('firstName_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'), limit(5)),
          query(usersCol, where('lastName_lowercase', '>=', lowerCaseSearchQuery), where('lastName_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'), limit(5)),
        ];

        const userSnapshots = await Promise.all(userQueries.map((q) => getDocs(q)));
        userSnapshots.forEach((userSnap) => {
          userSnap.forEach((doc) => {
            if (!results.some((r) => r.id === doc.id && r.type === 'user')) {
              const data = doc.data();
              results.push({
                id: doc.id,
                type: 'user',
                name: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown User',
                description: data.email,
                path: `/dashboard/users/${doc.id}`,
              });
            }
          });
        });

        const eventsCol = collection(firestore, 'events');
        const eventQuery = query(
          eventsCol,
          where('name_lowercase', '>=', lowerCaseSearchQuery),
          where('name_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'),
          limit(10)
        );
        const eventSnap = await getDocs(eventQuery);
        eventSnap.forEach((doc) => {
          const data = doc.data();
          results.push({
            id: doc.id,
            type: 'event',
            name: data.name || 'Unnamed Event',
            description: data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : undefined,
            path: `/dashboard/events/${doc.id}`,
          });
        });

        const vendorsCol = collection(firestore, 'vendors');
        const vendorQuery = query(
          vendorsCol,
          where('name_lowercase', '>=', lowerCaseSearchQuery),
          where('name_lowercase', '<=', lowerCaseSearchQuery + '\uf8ff'),
          limit(10)
        );
        const vendorSnap = await getDocs(vendorQuery);
        vendorSnap.forEach((doc) => {
          const data = doc.data();
          results.push({
            id: doc.id,
            type: 'vendor',
            name: data.name || 'Unnamed Vendor',
            description: data.categoryIds?.[0],
            path: `/dashboard/vendors/${doc.id}`,
          });
        });

        const uniqueResults = Array.from(
          new Map(results.map((item) => [item.id + item.type, item])).values()
        );
        setSearchResults(uniqueResults.slice(0, 10));
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, isAdminRoute]);

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
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getAvatarFallback = (name?: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'U';
    }
    return 'U';
  };

  return (
    <header className="h-[72px] flex items-center px-4 sm:px-6 bg-background border-b border-border/50 sticky top-0 z-10">
      {/* Left: menu + logo */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {isUserAppRoute && (
          <Link to="/dashboard/user" className="flex-shrink-0">
            <img src={tealTextLogo} alt="Kinship Sync" className="h-9 sm:h-10 w-auto object-contain" />
          </Link>
        )}
      </div>

      {/* Center: admin search */}
      {isAdminRoute ? (
        <div className="flex-1 flex justify-center px-4" ref={searchContainerRef}>
          <div className="relative w-full max-w-xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users, events, vendors..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full border-border bg-card text-sm focus-visible:ring-secondary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsResultsVisible(true)}
            />
            {isResultsVisible && searchQuery && (
              <div className="absolute mt-2 w-full max-h-80 overflow-y-auto bg-popover border border-border/40 rounded-xl shadow-lg z-20">
                {isSearchLoading && (
                  <div className="p-3 text-sm text-muted-foreground">Searching...</div>
                )}
                {!isSearchLoading && searchResults.length === 0 && (
                  <div className="p-3 text-sm text-muted-foreground">
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
                {!isSearchLoading &&
                  searchResults.map((item) => (
                    <Link
                      to={item.path}
                      key={item.id + item.type}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => {
                        setIsResultsVisible(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="font-medium">
                        {item.name}{' '}
                        <span className="text-xs text-muted-foreground">({item.type})</span>
                      </div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      )}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {isUserAppRoute && (
          <Button
            asChild
            className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-10 px-4 sm:px-5 text-sm font-semibold shadow-sm border-0"
          >
            <Link to="/dashboard/user/events/create">
              <FiPlus className="w-4 h-4 mr-1.5" />
              New Event
            </Link>
          </Button>
        )}

        <button
          ref={ref}
          type="button"
          title="Notifications"
          onClick={onToggleNotificationDrawer}
          className="relative w-10 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          <FiBell className="w-5 h-5" />
          {props.unreadCount && props.unreadCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-secondary ring-2 ring-background" />
          ) : null}
        </button>

        <button
          type="button"
          title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          {themeMode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {isUserAppRoute && currentUser && (
          <Button
            variant="ghost"
            className="hidden sm:flex items-center gap-1 p-1 rounded-full h-auto hover:bg-muted"
            onClick={() => navigate('/dashboard/user/profile')}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={(userProfile?.avatarUrl || currentUser?.photoURL) ?? undefined}
                alt={currentUser.displayName || 'User'}
              />
              <AvatarFallback>{getAvatarFallback(currentUser.displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        )}

        {!isUserAppRoute && currentUser && (
          <DropdownMenu onOpenChange={onProfileDropdownToggle}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 p-1 rounded-full h-auto hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={(userProfile?.avatarUrl || currentUser?.photoURL) ?? undefined}
                    alt={currentUser.displayName || 'User'}
                  />
                  <AvatarFallback>{getAvatarFallback(currentUser.displayName)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userProfile?.displayName || currentUser.displayName || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigate(isVendor && !isAdmin ? '/dashboard/vendor/profile' : '/dashboard/user/profile')
                }
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {themeMode === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                {themeMode === 'light' ? 'Dark mode' : 'Light mode'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
