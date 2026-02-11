import { api } from '@/shared/utils/api';

export async function listModules() {
  const { data } = await api('/modules');
  return data;
}
