import { useAuth } from '@/shared/hooks/useAuth';
import { ROLES } from '@/shared/constants/roles';

/**
 * Restricts children to given roles. Redirect or hide based on enabled modules.
 */
export function RoleGuard({ children, allowedRoles = [], requireModule }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;
  if (allowedRoles.length && !allowedRoles.includes(user.role)) return null;
  if (requireModule && user.enabled_modules && !user.enabled_modules.includes(requireModule)) return null;

  return children;
}
