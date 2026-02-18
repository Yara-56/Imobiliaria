import api from "@/core/api/api";
import type { Tenant, CreateTenantDTO, UpdateTenantDTO } from "../types/tenant.js"; // ✅ .js para NodeNext

interface ApiResponse<T> {
  status: string;
  data: T;
  results?: number;
  message?: string;
}

/**
 * Helper interno para converter DTO em FormData
 * 🛡️ Garante a integridade do upload para a nuvem.
 */
function buildFormData(payload: any) {
  // Se já for FormData (enviado pelo TenantForm), retornamos direto
  if (payload instanceof FormData) return payload;

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "documentFile" && value instanceof File) {
      // ✅ Alinhado com o campo 'documents' que o backend espera
      formData.append("documents", value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * TENANT API – PADRÃO PRODUÇÃO v3
 */
export const tenantApi = {
  /**
   * LISTAR TODOS
   */
  list: async (): Promise<Tenant[]> => {
    const { data } = await api.get<ApiResponse<{ tenants: Tenant[] }>>("/tenants");
    return data.data.tenants; // ✅ Ajustado para o mapeamento do seu controller
  },

  /**
   * BUSCAR POR ID (Nome corrigido para resolver ts(2339))
   */
  getById: async (id: string): Promise<Tenant> => {
    const { data } = await api.get<ApiResponse<{ tenant: Tenant }>>(`/tenants/${id}`);
    return data.data.tenant;
  },

  /**
   * CRIAR (com suporte a upload)
   */
  create: async (payload: CreateTenantDTO | FormData): Promise<Tenant> => {
    const formData = buildFormData(payload);

    const { data } = await api.post<ApiResponse<{ tenant: Tenant }>>(
      "/tenants",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data.data.tenant;
  },

  /**
   * ATUALIZAR (PATCH com upload opcional)
   */
  update: async (id: string, payload: UpdateTenantDTO | FormData): Promise<Tenant> => {
    const formData = buildFormData(payload);

    const { data } = await api.patch<ApiResponse<{ tenant: Tenant }>>(
      `/tenants/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data.data.tenant;
  },

  /**
   * DELETAR
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },

  /**
   * STATUS / HEALTH CHECK
   */
  checkStatus: async (id: string): Promise<"online" | "offline"> => {
    const { data } = await api.get<
      ApiResponse<{ status: "online" | "offline" }>
    >(`/tenants/${id}/health`);

    return data.data.status;
  },
};