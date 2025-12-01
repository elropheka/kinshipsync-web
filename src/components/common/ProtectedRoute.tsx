import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserProfile } from '@/types/userTypes';

interface ProtectedRouteProps {
  allowedRole?: UserProfile['role']; // Role allowed to access this route
  children?: React.ReactNode; // For using <ProtectedRoute><Child/></ProtectedRoute>
  element?: React.ReactElement; // For using element={<ProtectedRoute element={<Page />} />}
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, children, element }) => {
  const { userProfile, loading } = useAuth(); // Use userProfile instead of currentUser
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Checking authorization...</div>;
  }

  if (!userProfile) {
    // User not logged in, redirect to login page
    // Pass the current location to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If allowedRole is specified, check if the user has it
  if (allowedRole) {
    const userRole = userProfile.role;
    const hasRequiredRole = userRole === allowedRole;

    if (!hasRequiredRole) {
      // User does not have the required role, redirect to an unauthorized page or home
      // For simplicity, redirecting to home. An <Unauthorized /> page would be better.
      console.warn(`User ${userProfile.email} does not have required role: ${allowedRole}. Has role: ${userRole}`);
      return <Navigate to="/" state={{ from: location }} replace />; 
    }
  }

  // User is authenticated and (if roles specified) authorized
  if (element) return element; // Render the element prop if provided
  if (children) return <>{children}</>; // Render children if provided
  return <Outlet />; // Default to rendering Outlet if used as a layout route
};

export default ProtectedRoute;
