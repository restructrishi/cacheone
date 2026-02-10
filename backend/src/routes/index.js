import { Router } from 'express';
import authRoutes from '../auth/auth.routes.js';
import organisationRoutes from '../modules/organisation/index.js';
import crmRoutes from '../modules/crm/index.js';
import hrmsRoutes from '../modules/hrms/index.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/organisations', organisationRoutes);
router.use('/crm', crmRoutes);
router.use('/hrms', hrmsRoutes);

export { router as routes };
