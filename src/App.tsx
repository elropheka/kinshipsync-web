import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Dashboard from '@/pages/admin/Dashboard';
import Events from '@/pages/admin/Events';
import Users from '@/pages/admin/Users';
import Vendors from '@/pages/admin/Vendors';
import RegisterVendor from '@/pages/admin/RegisterVendor';
import CreateThemePage from '@/pages/admin/CreateThemePage';
import CreateVendorCategoryPage from '@/pages/admin/CreateVendorCategoryPage';
import EventDetailPage from '@/pages/detail/EventDetailPage';
import UserDetailPage from '@/pages/detail/UserDetailPage';
import VendorDetailPage from '@/pages/detail/VendorDetailPage';
import UserEventsPage from '@/pages/user/UserEventsPage';
import ProfilePage from '@/pages/user/ProfilePage';
import DeleteAccountPage from '@/pages/user/DeleteAccountPage';
import EventsDashboardPage from '@/pages/dashboard/EventsDashboardPage';
import VendorDashboard from '@/pages/vendor/Dashboard';
import VendorProfile from '@/pages/vendor/Profile';
import VendorItems from '@/pages/vendor/Items';
import VendorEvents from '@/pages/vendor/Events';

function App() {
  return (
    <Routes>
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Default redirect for authenticated users */}
          <Route index element={<Navigate to="/dashboard/events" replace />} />

          {/* Admin Routes */}
          <Route path="admin">
            <Route index element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="users" element={<Users />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="register-vendor" element={<RegisterVendor />} />
            <Route path="create-theme" element={<CreateThemePage />} />
            <Route path="create-vendor-category" element={<CreateVendorCategoryPage />} />
          </Route>

          {/* Dashboard */}
          {/* <Route path="events"> */}
            <Route path="events" element={<EventsDashboardPage />} />
          {/* </Route> */}

          {/* Detail Pages */}
          <Route path="events/:eventId" element={<EventDetailPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="vendors/:id" element={<VendorDetailPage />} />

          {/* User Routes */}
          <Route path="user">
            <Route index element={<UserEventsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="delete-my-account" element={<DeleteAccountPage />} />
          </Route>

          {/* Vendor Routes */}
          <Route path="vendor">
            <Route index element={<VendorDashboard />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="items" element={<VendorItems />} />
            <Route path="events" element={<VendorEvents />} />
          </Route>
        </Route>
      </Routes>
  );
}

export default App;
