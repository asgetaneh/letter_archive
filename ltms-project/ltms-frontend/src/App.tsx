import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import RequirePermission from './components/RequirePermission';

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import IncomingLetters from './pages/letters/Incoming';
import OutgoingLetters from './pages/letters/Outgoing';
import InternalLetters from './pages/letters/Internal';
import PendingLetters from './pages/letters/Pending';
import SearchLetters from './pages/letters/Search';

import RoutingInbox from './pages/routing/Inbox';
import RoutingHistory from './pages/routing/History';
import RoutingOverdue from './pages/routing/Overdue';

import UsersPage from './pages/admin/Users';
import RolesPage from './pages/admin/Roles';

const router = createBrowserRouter([
  // Public route — no auth required
  {
    path: '/login',
    element: <Login />,
  },
  // Protected area — everything inside requires login
  {
    path: '/',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      { path: 'letters/incoming', element: <IncomingLetters /> },
      { path: 'letters/outgoing', element: <OutgoingLetters /> },
      { path: 'letters/internal', element: <InternalLetters /> },
      { path: 'letters/pending', element: <PendingLetters /> },
      { path: 'letters/search', element: <SearchLetters /> },

      { path: 'routing/inbox', element: <RoutingInbox /> },
      { path: 'routing/history', element: <RoutingHistory /> },
      { path: 'routing/overdue', element: <RoutingOverdue /> },

      {
        path: 'admin/users',
        element: (
          <RequirePermission permission="users.view">
            <UsersPage />
          </RequirePermission>
        ),
      },
      {
        path: 'admin/roles',
        element: (
          <RequirePermission permission="roles.view">
            <RolesPage />
          </RequirePermission>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}