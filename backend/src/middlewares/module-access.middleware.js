import { query } from '../config/db.js';
import { ForbiddenError } from '../utils/errors.js';
import { ROLES } from './role.middleware.js';

/** Module slugs - must match DB modules table */
export const MODULES = {
  ORGANISATION: 'organisation',
  CRM: 'crm',
  HRMS: 'hrms',
};

/**
 * Validates that the current user's organization has the given module enabled.
 * Super Admin bypasses check. Requires authMiddleware and req.user.role, req.user.org_id.
 * Attaches req.moduleSlug for downstream use.
 */
export const requireModuleAccess = (moduleSlug) => async (req, _res, next) => {
  try {
    if (req.user.role === ROLES.SUPER_ADMIN) {
      req.moduleSlug = moduleSlug;
      return next();
    }

    const orgId = req.user.org_id;
    if (!orgId) {
      next(new ForbiddenError('Organization context required'));
      return;
    }

    const orgHasModule = await query(
      `SELECT 1 FROM organization_modules om
       JOIN modules m ON m.id = om.module_id
       WHERE om.organization_id = $1 AND m.slug = $2 AND om.enabled = true`,
      [orgId, moduleSlug]
    );
    if (orgHasModule.rows.length === 0) {
      next(new ForbiddenError(`Module ${moduleSlug} is not enabled for this organization`));
      return;
    }

    if (req.user.role === ROLES.MODULE_USER) {
      const userHasAccess = await query(
        `SELECT 1 FROM user_module_access uma
         JOIN modules m ON m.id = uma.module_id
         WHERE uma.user_id = $1 AND m.slug = $2`,
        [req.user.id, moduleSlug]
      );
      const userRestricted = await query(
        'SELECT 1 FROM user_module_access WHERE user_id = $1 LIMIT 1',
        [req.user.id]
      );
      if (userRestricted.rows.length > 0 && userHasAccess.rows.length === 0) {
        next(new ForbiddenError(`You do not have access to module ${moduleSlug}`));
        return;
      }
    }

    req.moduleSlug = moduleSlug;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Ensures the request has an organization context (org_id in body, params, or user).
 * For Super Admin, org_id may come from body/params for cross-org operations.
 */
export const resolveOrgContext = (req, _res, next) => {
  const orgId = req.body?.org_id || req.params?.org_id || req.query?.org_id || req.user?.org_id;
  if (!orgId && req.user?.role !== ROLES.SUPER_ADMIN) {
    next(new ForbiddenError('Organization context required'));
    return;
  }
  req.resolvedOrgId = orgId;
  next();
};
