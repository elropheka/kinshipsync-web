import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/common/Sidebar';
import NotificationDrawer from '@/components/common/NotificationDrawer'; // Import NotificationDrawer
import { useNotifications } from '@/hooks/useNotifications'; // Import useNotifications

interface MainLayoutProps {
  children?: React.ReactNode; // Make children prop optional
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024); // Default open on lg screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(true);
      }
      // For smaller screens, the state is managed by the toggleSidebar function
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications();

  const notificationDrawerRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotificationDrawer = () => {
    setIsNotificationDrawerOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isNotificationDrawerOpen && 
          notificationDrawerRef.current && 
          !notificationDrawerRef.current.contains(event.target as Node) &&
          notificationButtonRef.current &&
          !notificationButtonRef.current.contains(event.target as Node)
         ) {
        toggleNotificationDrawer();
      }
    };

    if (isNotificationDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationDrawerOpen]); // Only re-run if isNotificationDrawerOpen changes

  const isContentBlurred = isNotificationDrawerOpen || isProfileDropdownOpen;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} />
      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <div className={clsx(
        "flex flex-col flex-1 transition-all duration-300",
        isContentBlurred ? "blur-sm" : "",
        // isSidebarOpen ? "md:ml-64" : "md:ml-20" // Adjust margin for sidebar width on larger screens
      )}>
        <Navbar
          ref={notificationButtonRef}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          onToggleNotificationDrawer={toggleNotificationDrawer}
          isNotificationDrawerOpen={isNotificationDrawerOpen}
          onProfileDropdownToggle={setIsProfileDropdownOpen}
          unreadCount={unreadCount}
        />
        <main className={clsx("flex-1 p-4 md:p-6 overflow-y-auto", isContentBlurred && "pointer-events-none")}>
          {children || <Outlet />}
        </main>
      </div>
      <NotificationDrawer 
        ref={notificationDrawerRef} 
        isOpen={isNotificationDrawerOpen} 
        onClose={toggleNotificationDrawer} 
        notifications={notifications}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
        loading={loading}
        error={error}
      />
      <style>
        {`
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }

        /* Modern custom scrollbar with short fixed-appearance thumb */
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
          border: 2px solid transparent;
          position: relative;
          /* This creates the visual effect of a fixed-size thumb */
          background-image: 
            linear-gradient(transparent, transparent),
            radial-gradient(circle at center, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
          background-clip: padding-box, padding-box;
          background-size: 100% 100%, 100% 50px;
          background-position: center, center;
          background-repeat: no-repeat;
          transition: all 0.3s ease;
          min-height: 20px; /* Minimum for usability */
        }

        /* White dot indicator */
        ::-webkit-scrollbar-thumb:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        ::-webkit-scrollbar-thumb:hover {
          background-image: 
            linear-gradient(transparent, transparent),
            radial-gradient(circle at center, hsl(var(--primary) / 0.8) 0%, hsl(var(--primary)) 100%);
          background-size: 100% 100%, 100% 50px;
          box-shadow: 0 0 8px hsl(var(--primary) / 0.3);
        }

        ::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Fallback for Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--primary)) rgba(0, 0, 0, 0.05);
        }

          /* Beautiful text selection */
          ::selection {
            background: hsl(var(--primary) / 0.2);
            color: hsl(var(--foreground));
            text-shadow: none;
          }

          ::-moz-selection {
            background: hsl(var(--primary) / 0.2);
            color: hsl(var(--foreground));
            text-shadow: none;
          }

          /* Enhanced focus outline */
          *:focus-visible {
            outline: 2px solid hsl(var(--primary));
            outline-offset: 2px;
            outline-style: solid;
            border-radius: 4px;
            transition: outline 0.2s ease;
          }

          /* Smooth transitions for interactive elements */
          a, button, input, textarea, select {
            transition: all 0.2s ease;
          }

          /* Better button cursor */
          button, 
          [role="button"],
          input[type="submit"],
          input[type="button"] {
            cursor: pointer;
          }

          /* Disabled state styling */
          button:disabled,
          input:disabled,
          textarea:disabled,
          select:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }

          /* Image optimization */
          img {
            max-width: 100%;
            height: auto;
            transition: opacity 0.3s ease;
          }

          /* Subtle hover effect for images */
          img:hover {
            opacity: 0.9;
          }

          /* Better form field styling */
          input:not([type="checkbox"]):not([type="radio"]),
          textarea,
          select {
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          input:focus:not([type="checkbox"]):not([type="radio"]),
          textarea:focus,
          select:focus {
            box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
          }

          /* Smooth opacity transitions */
          .fade-in {
            opacity: 0;
            animation: fadeIn 0.5s ease forwards;
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }

          /* Subtle box shadows for elevated elements */
          .shadow-soft {
            box-shadow: 0 2px 10px hsl(var(--foreground) / 0.08);
            transition: box-shadow 0.3s ease;
          }

          .shadow-soft:hover {
            box-shadow: 0 4px 20px hsl(var(--foreground) / 0.12);
          }

          /* Loading states */
          .loading {
            position: relative;
            overflow: hidden;
          }

          .loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, hsl(var(--background) / 0.4), transparent);
            animation: shimmer 1.5s infinite;
          }

          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          /* Better list styling */
          ul, ol {
            list-style-position: inside;
          }

          /* Smooth link underlines */
          a {
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
            transition: text-decoration-color 0.2s ease;
          }

          /* Webkit autofill styling */
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 1000px hsl(var(--primary) / 0.05) inset;
            transition: background-color 5000s ease-in-out 0s;
          }

          /* Hide preloader smoothly */
          body:not(.loading) #preloader {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
          }

          /* Section transitions */
          section {
            transition: opacity 0.3s ease-in-out;
          }

          /* Better checkbox and radio styling */
          input[type="checkbox"],
          input[type="radio"] {
            accent-color: hsl(var(--primary));
          }

          /* Placeholder text styling */
          ::placeholder {
            color: hsl(var(--muted-foreground));
            opacity: 1;
            transition: color 0.2s ease;
          }

          :focus::placeholder {
            color: hsl(var(--muted-foreground) / 0.7);
          }

          /* Better table styling */
          table {
            border-collapse: collapse;
            border-spacing: 0;
          }

          th, td {
            transition: background-color 0.2s ease;
          }

          tr:hover td {
            background-color: hsl(var(--primary) / 0.03);
          }

          /* Print optimizations */
          @media print {
            * {
              background: transparent !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MainLayout;
