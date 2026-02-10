import { Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { Link } from 'react-router-dom';
import { MODULES, MODULE_LABELS } from '@/shared/constants/modules';

export function MainLayout() {
  const { user, isAuthenticated } = useAuth();
  const enabledModules = user?.enabled_modules ?? [MODULES.ORGANISATION, MODULES.CRM, MODULES.HRMS];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <nav className="flex gap-4">
          <Link to="/dashboard" className="font-medium text-gray-700 hover:text-gray-900">Home</Link>
          {enabledModules.includes(MODULES.ORGANISATION) && (
            <Link to="/organisation" className="font-medium text-gray-700 hover:text-gray-900">
              {MODULE_LABELS[MODULES.ORGANISATION]}
            </Link>
          )}
          {enabledModules.includes(MODULES.CRM) && (
            <Link to="/crm" className="font-medium text-gray-700 hover:text-gray-900">
              {MODULE_LABELS[MODULES.CRM]}
            </Link>
          )}
          {enabledModules.includes(MODULES.HRMS) && (
            <Link to="/hrms" className="font-medium text-gray-700 hover:text-gray-900">
              {MODULE_LABELS[MODULES.HRMS]}
            </Link>
          )}
        </nav>
        {isAuthenticated && (
          <span className="text-sm text-gray-500">{user?.email}</span>
        )}
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
