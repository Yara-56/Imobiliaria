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
  
  if (data.phone) {
    formData.append("phone", data.phone);
  }
  
  if (data.plan) {
    formData.append("plan", data.plan);
  }
  
  if (data.rentValue !== undefined) {
    formData.append("rentValue", data.rentValue.toString());
  }
  
  if (data.billingDay !== undefined) {
    formData.append("billingDay", data.billingDay.toString());
  }
  
  if (data.autoUpdateContract !== undefined) {
    formData.append("autoUpdateContract", data.autoUpdateContract.toString());
  }
  
  if (data.settings) {
    formData.append("settings", JSON.stringify(data.settings));
  }
  
  // 📎 Upload de foto de perfil
  if (data.profilePhoto) {
    formData.append("profilePhoto", data.profilePhoto);
  }
  
  // 📎 Upload de múltiplos documentos
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
      const { data } = await http.get<any[]>("/tenants", {
        params: filters,
      });
      return data.map(mapApiToTenant);
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
      const { data } = await http.get<any>(`/tenants/${id}`);
      return mapApiToTenant(data);
    } catch (error) {
      console.error("Erro ao buscar inquilino:", error);
      throw new Error("Erro ao buscar inquilino");
    }
  },

  /**
   * Criar novo inquilino (com suporte a upload de arquivos)
   */
  create: async (payload: CreateTenantDTO): Promise<Tenant> => {
    try {
      // Se tiver arquivos (foto ou documentos), usa FormData
      const hasFiles = payload.profilePhoto || (payload.documents && payload.documents.length > 0);
      
      if (hasFiles) {
        const formData = createTenantFormData(payload);
        
        const { data } = await http.post<any>("/tenants", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return mapApiToTenant(data);
      } else {
        // Sem arquivos, envia JSON normal
        const apiPayload = mapTenantToApi(payload);
        const { data } = await http.post<any>("/tenants", apiPayload);
        return mapApiToTenant(data);
      }
    } catch (error: any) {
      console.error("Erro ao criar inquilino:", error);
      const errorMessage = error?.response?.data?.message || "Erro ao criar inquilino";
      throw new Error(errorMessage);
    }
  },

  /**
   * Atualizar inquilino
   */
  update: async (id: string, payload: UpdateTenantDTO): Promise<Tenant> => {
    try {
      // Se tiver arquivos, usa FormData
      const hasFiles = payload.profilePhoto || (payload.documents && payload.documents.length > 0);
      
      if (hasFiles) {
        const formData = new FormData();
        
        // Adiciona campos ao FormData
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
              value.forEach((file: File) => formData.append(key, file));
            } else if (typeof value === "number") {
              formData.append(key, value.toString());
            } else if (typeof value === "boolean") {
              formData.append(key, value.toString());
            } else if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
            } else if (typeof value === "string") {
              formData.append(key, value);
            }
          }
        });
        
        const { data } = await http.put<any>(`/tenants/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return mapApiToTenant(data);
      } else {
        // Sem arquivos, JSON normal
        const { data } = await http.put<any>(`/tenants/${id}`, payload);
        return mapApiToTenant(data);
      }
    } catch (error: any) {
      console.error("Erro ao atualizar inquilino:", error);
      const errorMessage = error?.response?.data?.message || "Erro ao atualizar inquilino";
      throw new Error(errorMessage);
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
   * 📎 Upload de documento individual para um inquilino
   * (Endpoint ainda não implementado no backend)
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
      
      const { data } = await http.post<any>(
        `/tenants/${tenantId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error: any) {
      console.error("Erro ao fazer upload do documento:", error);
      const errorMessage = error?.response?.data?.message || "Erro ao fazer upload do documento";
      throw new Error(errorMessage);
    }
  },

  /**
   * 📎 Listar documentos de um inquilino
   * (Endpoint ainda não implementado no backend)
   */
  getDocuments: async (tenantId: string): Promise<Document[]> => {
    try {
      const { data } = await http.get<Document[]>(`/tenants/${tenantId}/documents`);
      return data;
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      throw new Error("Erro ao buscar documentos");
    }
  },

  /**
   * 📎 Deletar documento
   * (Endpoint ainda não implementado no backend)
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