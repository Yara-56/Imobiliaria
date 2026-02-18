import api from "@/core/api/api";
import type { Tenant, CreateTenantDTO, UpdateTenantDTO } from "../types/tenant";

/**
 * Interface padrão de resposta do Backend Aura
 * Garante que o TypeScript entenda a estrutura { status, data, results }
 */
interface ApiResponse<T> {
  status: string;
  data: T;
  results?: number;
  message?: string;
}

/**
 * O MELHOR TENANTS API (PADRÃO PROFISSIONAL)
 */
export const tenantApi = {
  /**
   * Lista todos os inquilinos
   * @returns Lista de Tenant[] já extraída do envelope data
   */
  list: async (): Promise<Tenant[]> => {
    const { data } = await api.get<ApiResponse<Tenant[]>>("/tenants");
    return data.data;
  },

  /**
   * Busca um inquilino específico por ID ou Slug
   */
  get: async (idOrSlug: string): Promise<Tenant> => {
    const { data } = await api.get<ApiResponse<Tenant>>(`/tenants/${idOrSlug}`);
    return data.data;
  },

  /**
   * Cria um novo inquilino (Instância)
   */
  create: async (payload: CreateTenantDTO): Promise<Tenant> => {
    const { data } = await api.post<ApiResponse<Tenant>>("/tenants", payload);
    return data.data;
  },

  /**
   * Atualiza dados de um inquilino existente
   */
  update: async (id: string, payload: UpdateTenantDTO): Promise<Tenant> => {
    const { data } = await api.patch<ApiResponse<Tenant>>(`/tenants/${id}`, payload);
    return data.data;
  },

  /**
   * Remove um inquilino do sistema
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },

  /**
   * Verificação de saúde/status da instância (Exclusivo Aura v3)
   */
  checkStatus: async (id: string): Promise<'online' | 'offline'> => {
    const { data } = await api.get<ApiResponse<{ status: 'online' | 'offline' }>>(`/tenants/${id}/health`);
    return data.data.status;
  }
};