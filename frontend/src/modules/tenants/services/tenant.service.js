import api from '@/shared/services/api';

export async function listTenants({ q = '' } = {}) {
  const { data } = await api.get('/tenants', { params: { q } });
  return Array.isArray(data) ? data : data?.items ?? [];
}

export async function getTenant(id) {
  const { data } = await api.get(`/tenants/${id}`);
  return data;
}

export async function createTenant(payload) {
  await api.post('/tenants', payload);
}

export async function updateTenant(id, payload) {
  await api.put(`/tenants/${id}`, payload);
}

export async function deleteTenant(id) {
  await api.delete(`/tenants/${id}`);
}