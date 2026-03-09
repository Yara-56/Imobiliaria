import api from "@/core/api/httpClient";

import type {
  Tenant,
  CreateTenantDTO,
  UpdateTenantDTO,
} from "../types/tenant.types";

import { mapTenantToApi } from "../mappers/tenant.mapper";

/**
 * ======================================================
 * 📦 Padrão de resposta da API
 * ======================================================
 */
interface ApiResponse {
  status?: string;
  data: any;
  meta?: unknown;
  message?: string;
}

/**
 * ======================================================
 * 🛠 Utils — FormData
 * ======================================================
 */
const toFormData = (payload: Record<string, unknown>): FormData => {
  const form = new FormData();

  Object.entries(payload)
    .filter(([, value]) => value !== null && value !== undefined)
    .forEach(([key, value]) => {
      if (value instanceof File) { form.append(key, value); return; }
      if (typeof value === "object") { form.append(key, JSON.stringify(value)); return; }
      form.append(key, String(value));
    });

  return form;
};

const isMultipartPayload = (payload: unknown): boolean => {
  if (payload instanceof FormData) return true;
  if (typeof payload === "object" && payload !== null) {
    return Object.values(payload as object).some((v) => v instanceof File);
  }
  return false;
};

/**
 * ======================================================
 * 🔎 Normaliza resposta de lista
 * Suporta: { data: [] } | { data: { tenants: [] } }
 * ======================================================
 */
const extractTenantList = (responseData: any): Tenant[] => {
  const data = responseData?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tenants)) return data.tenants;
  if (Array.isArray(responseData)) return responseData;
  return [];
};

/**
 * ======================================================
 * 🚀 Smart Request — POST / PATCH
 * Detecta multipart automaticamente
 * ======================================================
 */
const smartRequest = async (
  method: "post" | "patch",
  url: string,
  payload: Record<string, unknown> | FormData
): Promise<Tenant> => {
  try {
    const multipart = isMultipartPayload(payload);
    const dataToSend =
      payload instanceof FormData ? payload
      : multipart ? toFormData(payload)
      : payload;

    const response = await api.request<ApiResponse>({
      method,
      url,
      data: dataToSend,
      headers: multipart ? { "Content-Type": "multipart/form-data" } : undefined,
    });

    return (
      response.data?.data?.tenant ??
      response.data?.data ??
      response.data
    );
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
   * 📄 Lista todos os inquilinos
   */
  list: async (): Promise<Tenant[]> => {
    try {
      const response = await api.get<ApiResponse>("/tenants");

      if (import.meta.env.DEV) {
        console.log("📋 Tenant list response:", response.data);
      }

      return extractTenantList(response.data);
    } catch (error: any) {
      console.error("❌ Error loading tenants:", error?.response?.data);
      throw error;
    }
  },

  /**
   * 🔎 Busca inquilino por ID
   */
  getById: async (id: string): Promise<Tenant> => {
    try {
      const response = await api.get<ApiResponse>(`/tenants/${id}`);

      return (
        response.data?.data?.tenant ??
        response.data?.data ??
        response.data
      );
    } catch (error: any) {
      console.error("❌ Error loading tenant:", error?.response?.data);
      throw error;
    }
  },

  /**
   * ➕ Cria inquilino
   */
  create: async (payload: CreateTenantDTO | FormData): Promise<Tenant> => {
    try {
      if (payload instanceof FormData) {
        return smartRequest("post", "/tenants", payload);
      }

      const mappedPayload = mapTenantToApi(payload);

      if (import.meta.env.DEV) {
        console.log("📤 Tenant payload:", mappedPayload);
      }

      return smartRequest("post", "/tenants", mappedPayload);
    } catch (error: any) {
      console.error("❌ Error creating tenant:", error?.response?.data);
      throw error;
    }
  },

  /**
   * ✏️ Atualiza inquilino
   */
  update: async (
    id: string,
    payload: UpdateTenantDTO | FormData
  ): Promise<Tenant> => {
    try {
      if (payload instanceof FormData) {
        return smartRequest("patch", `/tenants/${id}`, payload);
      }

      const mappedPayload = mapTenantToApi(payload as CreateTenantDTO);

      if (import.meta.env.DEV) {
        console.log("📤 Tenant update payload:", mappedPayload);
      }

      return smartRequest("patch", `/tenants/${id}`, mappedPayload);
    } catch (error: any) {
      console.error("❌ Error updating tenant:", error?.response?.data);
      throw error;
    }
  },

  /**
   * ❌ Remove inquilino
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
   * ❤️ Health check
   */
  checkStatus: async (id: string): Promise<"online" | "offline"> => {
    try {
      const response = await api.get<ApiResponse>(`/tenants/${id}/health`);
      return response.data?.data?.status ?? "offline";
    } catch (error: any) {
      console.error("❌ Error checking tenant status:", error?.response?.data);
      return "offline";
    }
  },
};