import { api } from '@/shared/utils/api';

const base = (orgId) => (orgId ? `?org_id=${orgId}` : '');

export async function getLeads(orgId) {
  const { data } = await api(`/crm/leads${base(orgId)}`);
  return data;
}

export async function getLeadById(id, orgId) {
  const { data } = await api(`/crm/leads/${id}${base(orgId)}`);
  return data;
}

export async function createLead(payload, orgId) {
  const body = orgId ? { ...payload, org_id: orgId } : payload;
  const { data } = await api('/crm/leads', { method: 'POST', body: JSON.stringify(body) });
  return data;
}

export async function getDeals(orgId) {
  const { data } = await api(`/crm/deals${base(orgId)}`);
  return data;
}

export async function getDealById(id, orgId) {
  const { data } = await api(`/crm/deals/${id}${base(orgId)}`);
  return data;
}

export async function createDeal(payload, orgId) {
  const body = orgId ? { ...payload, org_id: orgId } : payload;
  const { data } = await api('/crm/deals', { method: 'POST', body: JSON.stringify(body) });
  return data;
}
