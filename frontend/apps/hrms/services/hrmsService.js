import { api } from '@/shared/utils/api';

const base = (orgId) => (orgId ? `?org_id=${orgId}` : '');

export async function getEmployees(orgId) {
  const { data } = await api(`/hrms/employees${base(orgId)}`);
  return data;
}

export async function getEmployeeById(id, orgId) {
  const { data } = await api(`/hrms/employees/${id}${base(orgId)}`);
  return data;
}

export async function createEmployee(payload, orgId) {
  const body = orgId ? { ...payload, org_id: orgId } : payload;
  const { data } = await api('/hrms/employees', { method: 'POST', body: JSON.stringify(body) });
  return data;
}

export async function getAttendance(orgId, from, to) {
  const params = new URLSearchParams();
  if (orgId) params.set('org_id', orgId);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const { data } = await api(`/hrms/attendance?${params}`);
  return data;
}

export async function createAttendance(payload, orgId) {
  const body = orgId ? { ...payload, org_id: orgId } : payload;
  const { data } = await api('/hrms/attendance', { method: 'POST', body: JSON.stringify(body) });
  return data;
}

export async function getPayroll(orgId, period) {
  const params = new URLSearchParams();
  if (orgId) params.set('org_id', orgId);
  if (period) params.set('period', period);
  const { data } = await api(`/hrms/payroll?${params}`);
  return data;
}

export async function createPayroll(payload, orgId) {
  const body = orgId ? { ...payload, org_id: orgId } : payload;
  const { data } = await api('/hrms/payroll', { method: 'POST', body: JSON.stringify(body) });
  return data;
}
