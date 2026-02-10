import { Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/auth/login/LoginPage';
import { SignupPage } from '@/auth/signup/SignupPage';
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
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout />
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
