import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireSuperAdmin } from '../../middlewares/role.middleware.js';
import { requireModuleAccess, MODULES } from '../../middlewares/module-access.middleware.js';
import { validateOrganisationBody } from './middleware.js';
import * as organisationController from './controller.js';

const router = Router();

router.use(authMiddleware);
router.use(requireSuperAdmin);
router.use(requireModuleAccess(MODULES.ORGANISATION));

router.get('/', organisationController.list);
router.get('/:id', organisationController.getById);
router.post('/', validateOrganisationBody, organisationController.create);
router.put('/:id', organisationController.update);
router.put('/:id/modules', organisationController.setModules);
router.delete('/:id', organisationController.remove);

export default router;
