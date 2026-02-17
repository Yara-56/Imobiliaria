import api from "../../../core/api/api";
import type { Tenant } from "../types/tenant";

/**
 * 📡 Busca a lista de inquilinos.
 */
export const listTenants = async (): Promise<Tenant[]> => {
  const response = await api.get("/tenants");
  return response.data.data; 
};

/**
 * ✍️ Cria um novo inquilino.
 */
export const createTenant = async (payload: Partial<Tenant>): Promise<Tenant> => {
  const response = await api.post("/tenants", payload);
  return response.data.data;
};

/**
 * 🔄 Atualiza um inquilino existente.
 */
export const updateTenant = async (id: string, payload: Partial<Tenant>): Promise<Tenant> => {
  const response = await api.put(`/tenants/${id}`, payload);
  return response.data.data;
};