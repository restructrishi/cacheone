import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { MODULES, MODULE_LABELS } from '@/shared/constants/modules';
import { api } from '@/shared/utils/api';

export function AppLayout() {
  const { user, token, isAuthenticated } = useAuth();
  const [enabledModules, setEnabledModules] = useState(
    user?.enabled_modules ?? [MODULES.ORGANISATION, MODULES.CRM, MODULES.HRMS]
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api('/org/modules');
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setEnabledModules(data);
        }
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-primary transition-theme">
      <header className="sticky top-0 z-10 border-b border-subtle bg-elevated/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-primary hover:text-secondary transition-theme"
            >
              Home
            </Link>
            {enabledModules.includes(MODULES.ORGANISATION) && (
              <Link
                to="/dashboard/organisation"
                className="text-sm font-medium text-primary hover:text-secondary transition-theme"
              >
                {MODULE_LABELS[MODULES.ORGANISATION]}
              </Link>
            )}
            {enabledModules.includes(MODULES.CRM) && (
              <Link
                to="/dashboard/crm"
                className="text-sm font-medium text-primary hover:text-secondary transition-theme"
              >
                {MODULE_LABELS[MODULES.CRM]}
              </Link>
            )}
            {enabledModules.includes(MODULES.HRMS) && (
              <Link
                to="/dashboard/hrms"
                className="text-sm font-medium text-primary hover:text-secondary transition-theme"
              >
                {MODULE_LABELS[MODULES.HRMS]}
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated && (
              <span className="text-sm text-secondary">{user?.email}</span>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
