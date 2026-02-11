import { Router } from 'express';
import authRoutes from '../auth/auth.routes.js';
import organisationRoutes from '../modules/organisation/index.js';
import crmRoutes from '../modules/crm/index.js';
import hrmsRoutes from '../modules/hrms/index.js';
import inviteRoutes from '../modules/invites/index.js';
import moduleListRoutes from '../modules/module-list/routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/organisations', organisationRoutes);
router.use('/invites', inviteRoutes);
router.use('/modules', moduleListRoutes);
router.use('/crm', crmRoutes);
router.use('/hrms', hrmsRoutes);

export { router as routes };
