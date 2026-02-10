import * as crmService from './service.js';

/** CRM controller - placeholder. Uses req.resolvedOrgId for org isolation. */
export async function listLeads(req, res, next) {
  try {
    const orgId = req.resolvedOrgId;
    const data = await crmService.listLeads(orgId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getLead(req, res, next) {
  try {
    const { id } = req.params;
    const orgId = req.resolvedOrgId;
    const data = await crmService.getLeadById(id, orgId);
    if (!data) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createLead(req, res, next) {
  try {
    const payload = { ...req.body, org_id: req.resolvedOrgId };
    const data = await crmService.createLead(payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function listDeals(req, res, next) {
  try {
    const orgId = req.resolvedOrgId;
    const data = await crmService.listDeals(orgId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getDeal(req, res, next) {
  try {
    const { id } = req.params;
    const orgId = req.resolvedOrgId;
    const data = await crmService.getDealById(id, orgId);
    if (!data) return res.status(404).json({ success: false, message: 'Deal not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createDeal(req, res, next) {
  try {
    const payload = { ...req.body, org_id: req.resolvedOrgId };
    const data = await crmService.createDeal(payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
