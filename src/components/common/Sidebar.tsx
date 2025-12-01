import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/services/firebaseConfig';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { 
  LogOut, LayoutDashboard, ListChecks, Users, CalendarClock, UserPlus, 
  UserCog, Briefcase, FolderPlus, Palette, ChevronDown, ChevronRight, Trash2 
} from 'lucide-react';
import clsx from 'clsx';
import Logo from '@/assets/logo_l.png'; // Assuming you have a logo SVG file

interface SidebarProps {
  isOpen: boolean;
}

const SidebarNavLink: React.FC<{ 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  isOpen: boolean; 
  isSubItem?: boolean;
  exact?: boolean; // Optional for NavLink exact matching
}> = ({ to, icon: Icon, label, isOpen, isSubItem = false, exact = false }) => (
  <li>
    <NavLink
      to={to}
      end={exact} // Use NavLink's 'end' prop for exact matching if needed
      className={({ isActive }) =>
        clsx(
                  "flex items-center space-x-3 p-2 rounded-md hover:bg-muted",
        isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground",
          !isOpen && "justify-center",
          isOpen && isSubItem && "pl-8" 
        )
      }
      title={label}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {isOpen && <span>{label}</span>}
    </NavLink>
  </li>
);

const SidebarDropdownTrigger: React.FC<{
  icon: React.ElementType;
  label: string;
  isOpen: boolean; // Sidebar open state
  isDropdownOpen: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isOpen, isDropdownOpen, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center w-full space-x-3 p-2 rounded-md hover:bg-muted text-foreground",
        !isOpen && "justify-center" // Center icon when sidebar is closed
      )}
      title={label}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {isOpen && <span className="flex-grow text-left">{label}</span>}
      {isOpen && (isDropdownOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
    </button>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { currentUser, isAdmin, isVendor } = useAuth();
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);
  const [isVendorsDropdownOpen, setIsVendorsDropdownOpen] = useState(false); // State for vendors dropdown
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

   const homes = {
      admin: '/dashboard/admin',
      vendor: '/dashboard/vendor',
      user: '/dashboard/user'
    };

  // const getAvatarFallback = (name?: string | null) => {
  //   if (name) {
  //     const initials = name.split(' ').map((n) => n[0]).join('');
  //     return initials.toUpperCase() || 'U';
  //   }
  //   return 'U';
  // };

  return (
    <aside
      className={clsx(
        "bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-40 md:static",
        isOpen ? "w-64 p-4 space-y-6 translate-x-0" : "w-20 p-4 space-y-6 items-center -translate-x-full md:translate-x-0"
      )}
    >
      {currentUser && (
        <button className={clsx("flex flex-col items-center", isOpen ? "space-y-3" : "space-y-2")} onClick={
          () => navigate(homes[isAdmin ? 'admin' : isVendor ? 'vendor' : 'user'])
        }>
         <img src={Logo}/>
         
        </button>
      )}

      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1">
          {isAdmin && (
            <>
              {isOpen && <h3 className="px-2 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin Menu</h3>}
              <SidebarNavLink to="/dashboard/admin" icon={LayoutDashboard} label="Admin Dashboard" isOpen={isOpen} exact />
              <SidebarNavLink to="/dashboard/admin/users" icon={Users} label="Manage Users" isOpen={isOpen} />
              {/* Top-level "Manage Vendors" removed, now in dropdown below */}
              
              <SidebarDropdownTrigger
                icon={CalendarClock}
                label="Events"
                isOpen={isOpen}
                isDropdownOpen={isEventsDropdownOpen}
                onClick={() => setIsEventsDropdownOpen(!isEventsDropdownOpen)}
              />
              {isEventsDropdownOpen && (
                <ul className={clsx(isOpen ? "pl-4" : "mt-1", "space-y-1")}>
                  <SidebarNavLink to="/dashboard/admin/events" icon={ListChecks} label="Manage Events" isOpen={isOpen} isSubItem={isOpen} />
                  <SidebarNavLink to="/dashboard/admin/create-theme" icon={Palette} label="Create Theme" isOpen={isOpen} isSubItem={isOpen} />
                </ul>
              )}

              {/* Vendors Dropdown */}
              <SidebarDropdownTrigger
                icon={Briefcase} 
                label="Vendors"
                isOpen={isOpen}
                isDropdownOpen={isVendorsDropdownOpen}
                onClick={() => setIsVendorsDropdownOpen(!isVendorsDropdownOpen)}
              />
              {isVendorsDropdownOpen && (
                <ul className={clsx(isOpen ? "pl-4" : "mt-1", "space-y-1")}>
                  <SidebarNavLink to="/dashboard/admin/vendors" icon={ListChecks} label="Manage All Vendors" isOpen={isOpen} isSubItem={isOpen} />
                  <SidebarNavLink to="/dashboard/admin/register-vendor" icon={UserPlus} label="Register New Vendor" isOpen={isOpen} isSubItem={isOpen} />
                  <SidebarNavLink to="/dashboard/admin/create-vendor-category" icon={FolderPlus} label="Vendor Categories" isOpen={isOpen} isSubItem={isOpen} />
                  {/* Links to the current user's vendor space, accessible by admin */}
                  <SidebarNavLink to="/dashboard/vendor/" icon={LayoutDashboard} label="Vendor Dashboard View" isOpen={isOpen} isSubItem={isOpen} exact />
                  <SidebarNavLink to="/dashboard/vendor/items" icon={ListChecks} label="Vendor Items View" isOpen={isOpen} isSubItem={isOpen} />
                  <SidebarNavLink to="/dashboard/vendor/profile" icon={UserCog} label="Vendor Profile View" isOpen={isOpen} isSubItem={isOpen} />
                </ul>
              )}
              {/* "Create Theme" link moved into Events dropdown */}
            </>
          )}

          {/* Vendor specific menu - only if isVendor AND NOT isAdmin */}
          {isVendor && !isAdmin && (
            <>
              {isOpen && <h3 className="px-2 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Vendor Space</h3>}
              <SidebarNavLink to="/dashboard/vendor/" icon={LayoutDashboard} label="My Dashboard" isOpen={isOpen} exact />
              <SidebarNavLink to="/dashboard/vendor/items" icon={ListChecks} label="My Items/Services" isOpen={isOpen} />
              <SidebarNavLink to="/dashboard/vendor/profile" icon={UserCog} label="My Profile" isOpen={isOpen} />
            </>
          )}
          
          {!isAdmin && !isVendor && currentUser && (
            <>
              {isOpen && <h3 className="px-2 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Menu</h3>}
              <SidebarNavLink to="/dashboard/user" icon={CalendarClock} label="My Events" isOpen={isOpen} />
              <SidebarNavLink to="/dashboard/user/profile" icon={UserCog} label="My Profile" isOpen={isOpen} />
              <SidebarNavLink to="/dashboard/user/delete-my-account" icon={Trash2} label="Delete Account" isOpen={isOpen} />
            </>
          )}
        </ul>
      </nav>

      <div>
        <Button
          variant="ghost"
          className={clsx(
            "w-full flex items-center space-x-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-700/30 hover:text-red-600",
            !isOpen && "justify-center"
          )}
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
