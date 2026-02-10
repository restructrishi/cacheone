import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireModuleAccess, resolveOrgContext, MODULES } from '../../middlewares/module-access.middleware.js';
import * as crmController from './controller.js';
import { validateLeadBody, validateDealBody } from './middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(requireModuleAccess(MODULES.CRM));
router.use(resolveOrgContext);

router.get('/leads', crmController.listLeads);
router.get('/leads/:id', crmController.getLead);
router.post('/leads', validateLeadBody, crmController.createLead);

router.get('/deals', crmController.listDeals);
router.get('/deals/:id', crmController.getDeal);
router.post('/deals', validateDealBody, crmController.createDeal);

export default router;
