import { http } from "@/lib/http.js";
import { mapTenantToApi, mapApiToTenant } from "../mappers/tenant.mapper";
import type { CreateTenantDTO, UpdateTenantDTO, Tenant, Document, DocumentType } from "../types/tenant.types";

function extract<T>(res: any, field: string): T {
  return res?.data?.data?.[field];
}

function tenantForm(payload: CreateTenantDTO) {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v as any);
  });
  payload.documents?.forEach((f) => fd.append("documents", f));
  return fd;
}

export const tenantApi = {
  async list(filters?: Record<string, any>): Promise<Tenant[]> {
    const res = await http.get("/tenants", { params: filters });
    return extract<any[]>(res, "tenants")?.map(mapApiToTenant) ?? [];
  },

  async getById(id: string): Promise<Tenant> {
    const res = await http.get(`/tenants/${id}`);
    return mapApiToTenant(extract(res, "tenant"));
  },

  async create(payload: CreateTenantDTO): Promise<Tenant> {
    const hasFiles = payload.profilePhoto || payload.documents?.length;
    const body = hasFiles ? tenantForm(payload) : mapTenantToApi(payload);

    const res = await http.post("/tenants", body, {
      headers: hasFiles ? { "Content-Type": "multipart/form-data" } : {},
    });

    return mapApiToTenant(extract(res, "tenant"));
  },

  async update(id: string, data: UpdateTenantDTO): Promise<Tenant> {
    const res = await http.patch(`/tenants/${id}`, data);
    return mapApiToTenant(extract(res, "tenant"));
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/tenants/${id}`);
  },

  async uploadDocument(tenantId: string, type: DocumentType, file: File): Promise<Document> {
    const fd = new FormData();
    fd.append("type", type);
    fd.append("file", file);

    const res = await http.post(`/tenants/${tenantId}/documents`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extract(res, "document");
  },

  async getDocuments(tenantId: string): Promise<Document[]> {
    const res = await http.get(`/tenants/${tenantId}/documents`);
    return extract(res, "documents");
  },

  async deleteDocument(tenantId: string, documentId: string): Promise<void> {
    await http.delete(`/tenants/${tenantId}/documents/${documentId}`);
  },
};