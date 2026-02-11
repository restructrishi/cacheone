import { Navigate } from 'react-router-dom';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/auth/login/LoginPage';
import { SignupPage } from '@/auth/signup/SignupPage';
import { CreateWorkspacePage } from '@/pages/CreateWorkspacePage';
import { SetPasswordPage } from '@/pages/SetPasswordPage';
import { useAuth } from '@/shared/hooks/useAuth';

import { SuperAdminDashboard } from '@/pages/SuperAdminDashboard';
import { OrganisationDashboard } from '@/apps/organisation/pages/OrganisationDashboard';
import { CrmDashboard } from '@/apps/crm/pages/CrmDashboard';
import { HrmsDashboard } from '@/apps/hrms/pages/HrmsDashboard';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export const routes = [
  {
    path: '/',
    element: <MarketingLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  { path: 'set-password', element: <SetPasswordPage /> },
  {
    path: 'login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: 'signup',
    element: <AuthLayout />,
    children: [{ index: true, element: <SignupPage /> }],
  },
  {
    path: 'create-workspace',
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <CreateWorkspacePage /> }],
  },
  {
    path: 'dashboard',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: 'organisation', element: <OrganisationDashboard /> },
      { path: 'organisation/*', element: <OrganisationDashboard /> },
      { path: 'crm', element: <CrmDashboard /> },
      { path: 'crm/*', element: <CrmDashboard /> },
      { path: 'hrms', element: <HrmsDashboard /> },
      { path: 'hrms/*', element: <HrmsDashboard /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];
