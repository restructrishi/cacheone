import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireOrgAdminOrSuper } from '../../middlewares/role.middleware.js';
import { resolveOrgContext } from '../../middlewares/module-access.middleware.js';
import * as inviteController from './invite.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(requireOrgAdminOrSuper);
router.post('/', inviteController.createInvite);
router.get('/', resolveOrgContext, inviteController.listInvites);

export default router;
