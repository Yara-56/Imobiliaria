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
 * 🛡️ Refinado: Trata objetos aninhados (settings) e tipos financeiros.
 */
function buildFormData(payload: any) {
  if (payload instanceof FormData) return payload;

  const formData = new FormData();
  
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // ✅ Tratamento especial para o upload de documentos do inquilino
    if (key === "documentFile" && value instanceof File) {
      formData.append("documents", value);
    } 
    // ✅ Tratamento para objetos aninhados (como o campo 'settings' do Tenant)
    else if (typeof value === 'object' && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    }
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * TENANT API – PADRÃO PRODUÇÃO v3 (Aura Engine)
 * Gerencia a inteligência contratual e o isolamento de inquilinos no MacBook.
 */
export const tenantApi = {
  /**
   * LISTAR TODOS
   */
  list: async (): Promise<Tenant[]> => {
    const { data } = await api.get<ApiResponse<{ tenants: Tenant[] }>>("/tenants");
    return data.data.tenants; // ✅ Mapeamento direto para o cluster
  },

  /**
   * BUSCAR POR ID
   */
  getById: async (id: string): Promise<Tenant> => {
    const { data } = await api.get<ApiResponse<{ tenant: Tenant }>>(`/tenants/${id}`);
    return data.data.tenant;
  },

  /**
   * CRIAR (Com suporte a upload de documentos e plano inicial)
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
   * ATUALIZAR (PATCH)
   * ✅ Agora suporta a sincronização de preferredPaymentMethod vinda do Financeiro.
   */
  update: async (id: string, payload: UpdateTenantDTO | FormData): Promise<Tenant> => {
    // Se não for FormData, enviamos como JSON para melhor performance do Node v20
    if (!(payload instanceof FormData)) {
      const { data } = await api.patch<ApiResponse<{ tenant: Tenant }>>(
        `/tenants/${id}`,
        payload
      );
      return data.data.tenant;
    }

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
   * DELETAR (Remoção lógica ou física do cluster)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },

  /**
   * STATUS / HEALTH CHECK
   * Verifica se os serviços de automação (como envio de e-mail) estão ativos.
   */
  checkStatus: async (id: string): Promise<"online" | "offline"> => {
    const { data } = await api.get<
      ApiResponse<{ status: "online" | "offline" }>
    >(`/tenants/${id}/health`);

    return data.data.status;
  },
};