import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/services/firebaseConfig';
import { signOut as firebaseSignOut } from 'firebase/auth';
import {
  LayoutDashboard, ListChecks, Users, CalendarClock, UserCog,
  Briefcase, Settings, CreditCard, LogOut, X,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  to: string;
}

const adminItems: NavItem[] = [
  { label: 'Admin', icon: LayoutDashboard, to: '/dashboard/admin' },
  { label: 'Users', icon: Users, to: '/dashboard/admin/users' },
  { label: 'Events', icon: CalendarClock, to: '/dashboard/admin/events' },
  { label: 'Vendors', icon: Briefcase, to: '/dashboard/admin/vendors' },
  { label: 'Plans', icon: CreditCard, to: '/dashboard/admin/subscriptions/plans' },
  { label: 'Profile', icon: UserCog, to: '/dashboard/user/profile' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
];

const vendorItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/vendor' },
  { label: 'Items', icon: ListChecks, to: '/dashboard/vendor/items' },
  { label: 'Profile', icon: UserCog, to: '/dashboard/vendor/profile' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
];

const userItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/user' },
  { label: 'Events', icon: CalendarClock, to: '/dashboard/user/events' },
  { label: 'Profile', icon: UserCog, to: '/dashboard/user/profile' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
];

const MobileBottomNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, isVendor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const items = isAdmin ? adminItems : isVendor ? vendorItems : userItems;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNav = (to: string) => {
    navigate(to);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const radius = 150;
  const itemCount = items.length;
  const angleStep = itemCount > 1 ? 140 / (itemCount - 1) : 0;
  const startAngle = -70;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Radial menu items */}
      <div
        ref={menuRef}
        className="fixed bottom-24 left-1/2 z-50 md:hidden"
        style={{ transform: 'translateX(-50%)' }}
      >
        {isOpen && items.map((item, i) => {
          const angle = (startAngle + i * angleStep) * (Math.PI / 180);
          const x = Math.sin(angle) * radius;
          const y = -Math.cos(angle) * radius;
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <button
              key={item.to}
              type="button"
              onClick={() => handleNav(item.to)}
              className="absolute flex flex-col items-center gap-1 transition-all duration-300"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) scale(${isOpen ? 1 : 0})`,
                opacity: isOpen ? 1 : 0,
                transitionDelay: `${i * 30}ms`,
              }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground border border-border'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-white drop-shadow-md whitespace-nowrap bg-black/50 px-2 py-0.5 rounded-full">
                {item.label}
              </span>
            </button>
          );
        })}
        {isOpen && (
          <button
            type="button"
            onClick={handleLogout}
            className="absolute flex flex-col items-center gap-1 transition-all duration-300"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${isOpen ? 1 : 0})`,
              opacity: isOpen ? 1 : 0,
              transitionDelay: `${itemCount * 30}ms`,
            }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-red-500 text-white">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md whitespace-nowrap bg-black/50 px-2 py-0.5 rounded-full">
              Logout
            </span>
          </button>
        )}
      </div>

      {/* Pill FAB */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      >
        <div className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-destructive text-destructive-foreground scale-110'
            : 'bg-primary text-primary-foreground'
        }`}>
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-semibold">Menu</span>
            </>
          )}
        </div>
      </button>
    </>
  );
};

export default MobileBottomNav;
