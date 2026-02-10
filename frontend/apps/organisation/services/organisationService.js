import { api } from '@/shared/utils/api';

export async function getOrganisations(withModules = false) {
  const url = withModules ? '/organisations?with_modules=true' : '/organisations';
  const { data } = await api(url);
  return data;
}

export async function getOrganisationById(id) {
  const { data } = await api(`/organisations/${id}`);
  return data;
}

export async function createOrganisation(payload) {
  const { data } = await api('/organisations', { method: 'POST', body: JSON.stringify(payload) });
  return data;
}

export async function updateOrganisation(id, payload) {
  const { data } = await api(`/organisations/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return data;
}

export async function deleteOrganisation(id) {
  await api(`/organisations/${id}`, { method: 'DELETE' });
}
