import * as crmModel from './model.js';

/** CRM service - placeholder. No cross-module direct access. */
export async function listLeads(orgId) {
  return crmModel.findLeadsByOrg(orgId);
}

export async function getLeadById(id, orgId) {
  return crmModel.findLeadById(id, orgId);
}

export async function createLead(data) {
  return crmModel.createLead(data);
}

export async function listDeals(orgId) {
  return crmModel.findDealsByOrg(orgId);
}

export async function getDealById(id, orgId) {
  return crmModel.findDealById(id, orgId);
}

export async function createDeal(data) {
  return crmModel.createDeal(data);
}
