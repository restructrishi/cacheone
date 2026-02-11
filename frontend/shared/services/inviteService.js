import { api } from '@/shared/utils/api';

export async function createInvite(payload) {
  const { data } = await api('/invites', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function listInvites(organizationId) {
  const { data } = await api(`/invites?organizationId=${organizationId}`);
  return data;
}
