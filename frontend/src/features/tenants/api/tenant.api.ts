// src/features/tenants/api/tenant.api.ts

import { http } from "@/lib/http";
import {
  mapTenantToApi,
  mapApiToTenant,
} from "../mappers/tenant.mapper";

import type {
  CreateTenantDTO,
  UpdateTenantDTO,
  Tenant,
  Document,
  DocumentType,
} from "../types/tenant.types";

/**
 * Converte CreateTenantDTO para FormData (para upload de arquivos)
 */
function createTenantFormData(data: CreateTenantDTO): FormData {
  const formData = new FormData();

  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("document", data.document);
  formData.append("preferredPaymentMethod", data.preferredPaymentMethod);

  if (data.phone) formData.append("phone", data.phone);
  if (data.plan) formData.append("plan", data.plan);
  if (data.rentValue !== undefined) formData.append("rentValue", String(data.rentValue));
  if (data.billingDay !== undefined) formData.append("billingDay", String(data.billingDay));
  if (data.autoUpdateContract !== undefined)
    formData.append("autoUpdateContract", String(data.autoUpdateContract));
  if (data.settings) formData.append("settings", JSON.stringify(data.settings));

  if (data.profilePhoto) formData.append("profilePhoto", data.profilePhoto);

  if (data.documents && data.documents.length > 0) {
    data.documents.forEach((file) => {
      formData.append("documents", file);
    });
  }

  return formData;
}

/**
 * API de Tenants
 */
export const tenantApi = {
  /**
   * Listar todos os inquilinos
   */
  list: async (filters?: Record<string, any>): Promise<Tenant[]> => {
    try {
      const { data } = await http.get("/tenants", { params: filters });

      // BACKEND RETORNA:
      // { status: "success", data: { tenants: [...] } }
      const tenants = data?.data?.tenants ?? [];

      return tenants.map(mapApiToTenant);
    } catch (error) {
      console.error("Erro ao listar inquilinos:", error);
      throw new Error("Erro ao buscar inquilinos");
    }
  },

  /**
   * Buscar inquilino por ID
   */
  getById: async (id: string): Promise<Tenant> => {
    try {
      const { data } = await http.get(`/tenants/${id}`);
      return mapApiToTenant(data?.data?.tenant);
    } catch (error) {
      console.error("Erro ao buscar inquilino:", error);
      throw new Error("Erro ao buscar inquilino");
    }
  },

  /**
   * Criar novo inquilino (com suporte a upload)
   */
  create: async (payload: CreateTenantDTO): Promise<Tenant> => {
    try {
      const hasFiles =
        payload.profilePhoto ||
        (payload.documents && payload.documents.length > 0);

      if (hasFiles) {
        const formData = createTenantFormData(payload);

        const { data } = await http.post("/tenants", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return mapApiToTenant(data?.data?.tenant);
      }

      const apiPayload = mapTenantToApi(payload);
      const { data } = await http.post("/tenants", apiPayload);

      return mapApiToTenant(data?.data?.tenant);
    } catch (error: any) {
      console.error("Erro ao criar inquilino:", error);
      throw new Error(error?.response?.data?.message || "Erro ao criar inquilino");
    }
  },

  /**
   * Atualizar inquilino
   */
  update: async (id: string, payload: UpdateTenantDTO): Promise<Tenant> => {
    try {
      const { data } = await http.patch(`/tenants/${id}`, payload);
      return mapApiToTenant(data?.data?.tenant);
    } catch (error: any) {
      console.error("Erro ao atualizar inquilino:", error);
      throw new Error(error?.response?.data?.message || "Erro ao atualizar inquilino");
    }
  },

  /**
   * Deletar inquilino
   */
  delete: async (id: string): Promise<void> => {
    try {
      await http.delete(`/tenants/${id}`);
    } catch (error) {
      console.error("Erro ao deletar inquilino:", error);
      throw new Error("Erro ao deletar inquilino");
    }
  },

  /**
   * Upload de documento individual
   */
  uploadDocument: async (
    tenantId: string,
    type: DocumentType,
    file: File
  ): Promise<Document> => {
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);

      const { data } = await http.post(
        `/tenants/${tenantId}/documents`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return data?.data;
    } catch (error: any) {
      console.error("Erro ao fazer upload do documento:", error);
      throw new Error(error?.response?.data?.message || "Erro ao fazer upload do documento");
    }
  },

  /**
   * Listar documentos do inquilino
   */
  getDocuments: async (tenantId: string): Promise<Document[]> => {
    try {
      const { data } = await http.get(`/tenants/${tenantId}/documents`);
      return data?.data?.documents || [];
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      throw new Error("Erro ao buscar documentos");
    }
  },

  /**
   * Deletar documento
   */
  deleteDocument: async (tenantId: string, documentId: string): Promise<void> => {
    try {
      await http.delete(`/tenants/${tenantId}/documents/${documentId}`);
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      throw new Error("Erro ao deletar documento");
    }
  },
};