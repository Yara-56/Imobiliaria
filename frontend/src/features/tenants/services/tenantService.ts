import api from "../../../core/api/api"; // ✅ Caminho relativo para evitar erro de alias
import type { Tenant } from "../types/tenant"; // ✅ Aponta para a pasta que você criou

/**
 * 📡 Busca a lista de inquilinos da AuraImobi.
 */
export const listTenants = async (): Promise<Tenant[]> => {
  // O seu backend Node retorna os dados em response.data.data
  const response = await api.get("/tenants");
  return response.data.data; 
};

/**
 * ✍️ Cria um novo inquilino no banco de dados.
 */
export const createTenant = async (payload: Partial<Tenant>): Promise<Tenant> => {
  const response = await api.post("/tenants", payload);
  return response.data.data;
};

/**
 * 🔄 Atualiza um inquilino existente (Substitui o antigo Edit).
 */
export const updateTenant = async (id: string, payload: Partial<Tenant>): Promise<Tenant> => {
  const response = await api.put(`/tenants/${id}`, payload);
  return response.data.data;
};