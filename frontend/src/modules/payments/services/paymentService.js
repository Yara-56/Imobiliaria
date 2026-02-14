import api from '@/shared/services/api';

export async function listTenants() {
  const response = await api.get('/tenants');

  return Array.isArray(response.data)
    ? response.data
    : response.data?.items ?? [];
}

export async function listPayments() {
  const response = await api.get('/payments');

  return Array.isArray(response.data)
    ? response.data
    : response.data?.items ?? [];
}