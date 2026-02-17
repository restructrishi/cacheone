import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles, ROLES } from '../middlewares/role.middleware.js';
import { getEnabledModulesForUser } from '../auth/auth.service.js';

const router = Router();

router.use(authMiddleware);

router.get('/modules', requireRoles(ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MODULE_USER), async (req, res, next) => {
  try {
    const modules = await getEnabledModulesForUser(
      req.user.id,
      req.user.org_id ?? null,
      req.user.role
    );
    res.json({ success: true, data: modules });
  } catch (err) {
    next(err);
  }
});

export default router;

