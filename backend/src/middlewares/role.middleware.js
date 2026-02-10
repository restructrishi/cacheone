import { ForbiddenError } from '../utils/errors.js';

/** Role names - Super Admin is not org-scoped */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'org_admin',
  MODULE_USER: 'module_user',
};

/**
 * Restricts access to given roles. Use after authMiddleware.
 * req.user must contain role (and org_id for non-super-admin).
 */
export const requireRoles = (...allowedRoles) => (req, _res, next) => {
  const role = req.user?.role;
  if (!role || !allowedRoles.includes(role)) {
    next(new ForbiddenError('Insufficient permissions'));
    return;
  }
  next();
};

/**
 * Ensures request is from Super Admin only.
 */
export const requireSuperAdmin = requireRoles(ROLES.SUPER_ADMIN);

/**
 * Ensures request is from Org Admin or Super Admin.
 */
export const requireOrgAdminOrSuper = requireRoles(ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN);
