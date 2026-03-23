import api from "@/core/api/httpClient";

import type {
  Property,
  PropertyUI,
  PropertyStatus,
  CreatePropertyDTO,
  UpdatePropertyDTO,
} from "../types/property";

import { PROPERTY_STATUS_MAP } from "../types/property";

interface ApiResponse {
  status?: string;
  data: any;
  results?: number;
  meta?: unknown;
}

const mapToUI = (p: Property | any): PropertyUI => ({
  id: p.id ?? p._id,
  name: p.name ?? "",
  addressText: `${p.street ?? ""}, ${p.number ?? ""} - ${p.neighborhood ?? ""}, ${p.city ?? ""}/${p.state ?? ""}`,
  cep: p.zipCode ?? "",
  city: p.city ?? "",
  state: p.state ?? "",
  street: p.street ?? "",
  neighborhood: p.neighborhood ?? "",
  number: p.number ?? "",
  sqls: p.sqls ?? "",
  status: PROPERTY_STATUS_MAP[p.status as PropertyStatus] ?? "Disponível",
  statusRaw: (p.status as PropertyStatus) ?? "DISPONIVEL",
  documents: (p.documents ?? []).map((doc: any) => {
    const rawFileUrl =
      typeof doc.fileUrl === "string" && doc.fileUrl.trim()
        ? doc.fileUrl.trim()
        : typeof doc.url === "string" && doc.url.trim()
          ? doc.url.trim()
          : typeof doc.filename === "string" && doc.filename.trim()
            ? `/uploads/properties/${doc.filename.trim()}`
            : "";

    return {
      id: doc.id ?? doc._id,
      fileName: doc.fileName ?? doc.originalName ?? doc.filename ?? "",
      fileUrl: rawFileUrl,
      mimeType: doc.mimeType ?? null,
      size: doc.size ?? null,
      createdAt: doc.createdAt,
      originalName: doc.originalName ?? "",
      filename: doc.filename ?? "",
      url: doc.url ?? "",
    };
  }),
  createdAt: p.createdAt,
});

const mapToApi = (
  payload: CreatePropertyDTO | UpdatePropertyDTO
): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    name: payload.name,
    city: payload.city,
    state: payload.state,
    zipCode: payload.zipCode,
    street: payload.street,
    neighborhood: payload.neighborhood,
    number: payload.number,
    sqls: payload.sqls,
    status: payload.status,
  };

  // ✅ Envia apenas o ID dos documentos existentes
  // O backend usa isso para saber quais documentos manter (não deletar)
  if ("documents" in payload && Array.isArray(payload.documents)) {
    body.existingDocuments = payload.documents
      .filter((doc: any) => !!doc.id)
      .map((doc: any) => ({ id: doc.id }));
  }

  return body;
};

const extractList = (data: any): PropertyUI[] => {
  const raw = data?.data?.properties ?? data?.data ?? data ?? [];
  return Array.isArray(raw) ? raw.map(mapToUI) : [];
};

const buildFormData = (
  body: Record<string, unknown>,
  files: File[],
  fileField = "documents"
): FormData => {
  const form = new FormData();

  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;

    if (key === "existingDocuments") {
      // ✅ Serializa o array de IDs como JSON string
      form.append(key, JSON.stringify(value));
      return;
    }

    if (Array.isArray(value) || typeof value === "object") {
      form.append(key, JSON.stringify(value));
      return;
    }

    form.append(key, String(value));
  });

  files.forEach((file) => {
    form.append(fileField, file);
  });

  return form;
};

export const propertiesApi = {
  list: async (
    params?: { page?: number; limit?: number; status?: string },
    signal?: AbortSignal
  ): Promise<PropertyUI[]> => {
    const response = await api.get<ApiResponse>("/properties", {
      params,
      signal,
    });

    return extractList(response.data);
  },

  getById: async (id: string): Promise<PropertyUI | null> => {
    const response = await api.get<ApiResponse>(`/properties/${id}`);
    const raw = response.data?.data?.property ?? response.data?.data;
    return raw ? mapToUI(raw) : null;
  },

  create: async (
    payload: CreatePropertyDTO,
    files: File[] = []
  ): Promise<PropertyUI> => {
    const body = mapToApi(payload);

    const response =
      files.length > 0
        ? await api.post<ApiResponse>("/properties", buildFormData(body, files))
        : await api.post<ApiResponse>("/properties", body);

    const raw = response.data?.data?.property ?? response.data?.data;
    return mapToUI(raw);
  },

  update: async (
    id: string,
    payload: UpdatePropertyDTO,
    files: File[] = []
  ): Promise<PropertyUI> => {
    const body = mapToApi(payload);

    const response =
      files.length > 0
        ? await api.patch<ApiResponse>(
            `/properties/${id}`,
            buildFormData(body, files)
          )
        : await api.patch<ApiResponse>(`/properties/${id}`, body);

    const raw = response.data?.data?.property ?? response.data?.data;
    return mapToUI(raw);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};