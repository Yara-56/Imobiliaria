import axios from 'axios';

// Definição da Interface do Inquilino
export interface Tenant {
  id: string | number;
  name: string;
  property: string;
  value: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const listTenants = async (): Promise<Tenant[]> => {
  try {
    const { data } = await api.get<Tenant[]>('/tenants');
    return data;
  } catch (error) {
    throw new Error("Falha ao sincronizar inquilinos.");
  }
};

export const createTenant = async (tenantData: Partial<Tenant>): Promise<Tenant> => {
  const { data } = await api.post<Tenant>('/tenants', tenantData);
  return data;
};