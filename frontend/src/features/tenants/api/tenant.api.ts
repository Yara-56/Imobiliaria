import api from "@/core/api/api";
import type {
  Tenant,
  CreateTenantDTO,
  UpdateTenantDTO,
} from "../types/tenant.js";

/**
 * Envelope padrão do backend
 */
interface ApiResponse<T> {
  status: string;
  data: T;
  meta?: unknown;
  message?: string;
}

/**
 * Transforma qualquer payload em FormData automaticamente
 * - Mantém File
 * - Serializa objetos
 * - Remove null/undefined
 */
const toFormData = (payload: unknown): FormData => {
  if (payload instanceof FormData) return payload;

  const form = new FormData();

  Object.entries(payload as Record<string, unknown>)
    .filter(([, value]) => value !== null && value !== undefined)
    .forEach(([key, value]) => {
      if (value instanceof File) {
        form.append(key, value);
        return;
      }

      if (typeof value === "object") {
        form.append(key, JSON.stringify(value));
        return;
      }

      form.append(key, String(value));
    });

  return form;
};

/**
 * Request inteligente:
 * Detecta automaticamente se deve enviar JSON ou multipart
 */
const smartRequest = async <T>(
  method: "post" | "patch",
  url: string,
  payload: unknown
): Promise<T> => {
  const isMultipart =
    payload instanceof FormData ||
    Object.values(payload as Record<string, unknown>).some(
      (v) => v instanceof File
    );

  const dataToSend = isMultipart ? toFormData(payload) : payload;

  const response = await api.request<ApiResponse<T>>({
    method,
    url,
    data: dataToSend,
    headers: isMultipart
      ? { "Content-Type": "multipart/form-data" }
      : undefined,
  });

  return response.data.data;
};

/**
 * TENANT API — Clean Architecture Version
 */
export const tenantApi = {
  list: async (): Promise<Tenant[]> => {
    const { data } = await api.get<ApiResponse<Tenant[]>>("/tenants");
    return data.data ?? [];
  },

  getById: async (id: string): Promise<Tenant> => {
    const { data } = await api.get<ApiResponse<Tenant>>(
      `/tenants/${id}`
    );
    return data.data;
  },

  create: (payload: CreateTenantDTO | FormData) =>
    smartRequest<Tenant>("post", "/tenants", payload),

  update: (id: string, payload: UpdateTenantDTO | FormData) =>
    smartRequest<Tenant>("patch", `/tenants/${id}`, payload),

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },

  checkStatus: async (
    id: string
  ): Promise<"online" | "offline"> => {
    const { data } = await api.get<
      ApiResponse<{ status: "online" | "offline" }>
    >(`/tenants/${id}/health`);

    return data.data.status;
  },
};