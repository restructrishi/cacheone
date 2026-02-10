import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireModuleAccess, resolveOrgContext, MODULES } from '../../middlewares/module-access.middleware.js';
import { validateEmployeeBody, validateAttendanceBody } from './middleware.js';
import * as hrmsController from './controller.js';

const router = Router();

router.use(authMiddleware);
router.use(requireModuleAccess(MODULES.HRMS));
router.use(resolveOrgContext);

router.get('/employees', hrmsController.listEmployees);
router.get('/employees/:id', hrmsController.getEmployee);
router.post('/employees', validateEmployeeBody, hrmsController.createEmployee);

router.get('/attendance', hrmsController.listAttendance);
router.post('/attendance', validateAttendanceBody, hrmsController.createAttendance);

router.get('/payroll', hrmsController.listPayroll);
router.post('/payroll', hrmsController.createPayroll);

export default router;
