import * as hrmsService from './service.js';

/** HRMS controller - placeholder. Uses req.resolvedOrgId for org isolation. */
export async function listEmployees(req, res, next) {
  try {
    const orgId = req.resolvedOrgId;
    const data = await hrmsService.listEmployees(orgId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const orgId = req.resolvedOrgId;
    const data = await hrmsService.getEmployeeById(id, orgId);
    if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createEmployee(req, res, next) {
  try {
    const payload = { ...req.body, org_id: req.resolvedOrgId };
    const data = await hrmsService.createEmployee(payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function listAttendance(req, res, next) {
  try {
    const orgId = req.resolvedOrgId;
    const { from, to } = req.query;
    const data = await hrmsService.listAttendance(orgId, from || '1900-01-01', to || '2100-12-31');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createAttendance(req, res, next) {
  try {
    const payload = { ...req.body, org_id: req.resolvedOrgId };
    const data = await hrmsService.createAttendance(payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function listPayroll(req, res, next) {
  try {
    const orgId = req.resolvedOrgId;
    const { period } = req.query;
    const data = await hrmsService.listPayroll(orgId, period || '');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createPayroll(req, res, next) {
  try {
    const payload = { ...req.body, org_id: req.resolvedOrgId };
    const data = await hrmsService.createPayroll(payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
