import api from "@/core/api/httpClient";

import type {
  Tenant,
  CreateTenantDTO,
  UpdateTenantDTO,
} from "../types/tenant.enums";

import { mapTenantToApi } from "../mappers/tenant.mapper";

/**
 * ======================================================
 * 📦 Padrão de resposta da API
 * ======================================================
 */

interface ApiResponse<T> {
  status?: string;
  data: T;
  meta?: unknown;
  message?: string;
}

/**
 * ======================================================
 * 🛠 Utils
 * ======================================================
 */

/**
 * 🔄 Converte objeto para FormData
 */
const toFormData = (payload: Record<string, unknown>): FormData => {
  const form = new FormData();

  Object.entries(payload)
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
 * 🔎 Detecta se payload precisa ser multipart
 */
const isMultipartPayload = (payload: unknown): boolean => {
  if (payload instanceof FormData) return true;

  if (typeof payload === "object" && payload !== null) {
    return Object.values(payload).some((v) => v instanceof File);
  }

  return false;
};

/**
 * ======================================================
 * 🚀 Smart Request
 * ======================================================
 */

const smartRequest = async <T>(
  method: "post" | "patch",
  url: string,
  payload: Record<string, unknown> | FormData
): Promise<T> => {
  try {
    const multipart = isMultipartPayload(payload);

    const dataToSend =
      payload instanceof FormData
        ? payload
        : multipart
        ? toFormData(payload)
        : payload;

    const response = await api.request<ApiResponse<T>>({
      method,
      url,
      data: dataToSend,
      headers: multipart
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });

    /**
     * Proteção contra APIs que retornam formato diferente
     */
    const result = response.data?.data ?? response.data;

    return result as T;
  } catch (error: any) {
    console.error("❌ Tenant API Error:", error?.response?.data || error);
    throw error;
  }
};

/**
 * ======================================================
 * 🏢 Tenant API
 * ======================================================
 */

export const tenantApi = {
  /**
   * ======================================================
   * 📄 Lista todos os tenants
   * ======================================================
   */
  list: async (): Promise<Tenant[]> => {
    try {
      const response = await api.get<ApiResponse<Tenant[]>>("/tenants");

      const result = response.data?.data ?? response.data;

      return Array.isArray(result) ? result : [];
    } catch (error: any) {
      console.error("❌ Error loading tenants:", error?.response?.data);
      throw error;
    }
  },

  /**
   * ======================================================
   * 🔎 Busca tenant por ID
   * ======================================================
   */
  getById: async (id: string): Promise<Tenant> => {
    try {
      const response = await api.get<ApiResponse<Tenant>>(`/tenants/${id}`);

      return response.data?.data ?? (response.data as unknown as Tenant);
    } catch (error: any) {
      console.error("❌ Error loading tenant:", error?.response?.data);
      throw error;
    }
  },

  /**
   * ======================================================
   * ➕ Cria tenant
   * ======================================================
   */
  create: async (
    payload: CreateTenantDTO | FormData
  ): Promise<Tenant> => {
    try {
      if (payload instanceof FormData) {
        return smartRequest<Tenant>("post", "/tenants", payload);
      }

      /**
       * 🔹 Converte DTO do frontend → formato da API
       */
      const mappedPayload = mapTenantToApi(payload);

      /**
       * 🧠 Debug opcional
       */
      if (import.meta.env.DEV) {
        console.log("📤 Tenant payload:", mappedPayload);
      }

      return smartRequest<Tenant>("post", "/tenants", mappedPayload);
    } catch (error: any) {
      console.error("❌ Error creating tenant:", error?.response?.data);
      throw error;
    }
  },

  /**
   * ======================================================
   * ✏️ Atualiza tenant
   * ======================================================
   */
  update: async (
    id: string,
    payload: UpdateTenantDTO | FormData
  ): Promise<Tenant> => {
    try {
      if (payload instanceof FormData) {
        return smartRequest<Tenant>("patch", `/tenants/${id}`, payload);
      }

      const mappedPayload = mapTenantToApi(payload as CreateTenantDTO);

      if (import.meta.env.DEV) {
        console.log("📤 Tenant update payload:", mappedPayload);
      }

      return smartRequest<Tenant>(
        "patch",
        `/tenants/${id}`,
        mappedPayload
      );
    } catch (error: any) {
      console.error("❌ Error updating tenant:", error?.response?.data);
      throw error;
    }
  },

  /**
   * ======================================================
   * ❌ Remove tenant
   * ======================================================
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tenants/${id}`);
    } catch (error: any) {
      console.error("❌ Error deleting tenant:", error?.response?.data);
      throw error;
    }
  },

  /**
   * ======================================================
   * ❤️ Health check do tenant
   * ======================================================
   */
  checkStatus: async (
    id: string
  ): Promise<"online" | "offline"> => {
    try {
      const response = await api.get<
        ApiResponse<{ status: "online" | "offline" }>
      >(`/tenants/${id}/health`);

      return response.data?.data?.status ?? "offline";
    } catch (error: any) {
      console.error("❌ Error checking tenant status:", error?.response?.data);
      return "offline";
    }
  },
};