import api from "@/core/api/httpClient";

import type {
  PropertyUI,
  PropertyStatus,
  PropertyType,
  CreatePropertyDTO,
  UpdatePropertyDTO,
} from "../types/property";

import {
  PROPERTY_STATUS_MAP,
  PROPERTY_STATUS_MAP_REVERSE,
  PROPERTY_TYPE_MAP,
} from "../types/property";

/**
 * ======================================================
 * 📦 Padrão de resposta da API
 * ======================================================
 */
interface ApiResponse {
  status?: string;
  data: any;
  results?: number;
  meta?: unknown;
}

/**
 * ======================================================
 * 🔄 Normalização — Backend → Frontend
 * ======================================================
 */
const mapToUI = (p: any): PropertyUI => ({
  id:             p.id ?? p._id,
  title:          p.title,
  addressText:    [p.address, p.city, p.state].filter(Boolean).join(", "),
  cep:            p.zipCode,
  price:          p.price ?? 0,
  priceFormatted: new Intl.NumberFormat("pt-BR", {
    style:    "currency",
    currency: "BRL",
  }).format(p.price ?? 0),
  status:      PROPERTY_STATUS_MAP[p.status as PropertyStatus] ?? "Disponível",
  statusRaw:   (p.status as PropertyStatus) ?? "DISPONIVEL",
  type:        PROPERTY_TYPE_MAP[p.type as PropertyType]   ?? "Casa",
  typeRaw:     p.type,
  description: p.description,
  documents:   p.documents ?? [],
  createdAt:   p.createdAt,
});

/**
 * ======================================================
 * 🔄 Normalização — Frontend → Backend
 * ======================================================
 */
const mapToApi = (payload: Partial<PropertyUI>): Record<string, unknown> => ({
  title:       payload.title,
  address:     payload.addressText,
  zipCode:     payload.cep,
  price:       payload.price,
  status:      payload.status
    ? PROPERTY_STATUS_MAP_REVERSE[payload.status]
    : undefined,
  type:        payload.typeRaw ?? payload.type,
  description: payload.description,
});

/**
 * ======================================================
 * 📎 Extrai lista de qualquer formato de resposta
 * ======================================================
 */
const extractList = (data: any): PropertyUI[] => {
  const raw =
    data?.data?.properties ??
    data?.data ??
    data ??
    [];
  return Array.isArray(raw) ? raw.map(mapToUI) : [];
};

/**
 * ======================================================
 * 📎 Monta FormData para uploads com arquivos
 * ======================================================
 */
const buildFormData = (
  body: Record<string, unknown>,
  files: File[],
  fileField = "documents"
): FormData => {
  const form = new FormData();

  Object.entries(body).forEach(([k, v]) => {
    if (v == null) return;
    form.append(k, String(v));
  });

  files.forEach((f) => form.append(fileField, f));

  return form;
};

/**
 * ======================================================
 * 🏠 Properties API
 * ======================================================
 */
export const propertiesApi = {

  /**
   * 📄 Listar imóveis
   */
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

  /**
   * 🔎 Buscar por ID
   */
  getById: async (id: string): Promise<PropertyUI | null> => {
    const response = await api.get<ApiResponse>(`/properties/${id}`);
    const raw =
      response.data?.data?.property ??
      response.data?.data;
    return raw ? mapToUI(raw) : null;
  },

  /**
   * ➕ Criar imóvel
   */
  create: async (
    payload: Partial<PropertyUI>,
    files: File[] = []
  ): Promise<PropertyUI> => {
    const body = mapToApi(payload);

    const response = files.length > 0
      ? await api.post<ApiResponse>("/properties", buildFormData(body, files))
      : await api.post<ApiResponse>("/properties", body);

    const raw =
      response.data?.data?.property ??
      response.data?.data;
    return mapToUI(raw);
  },

  /**
   * ✏️ Atualizar imóvel
   */
  update: async (
    id: string,
    payload: Partial<PropertyUI>,
    files: File[] = []
  ): Promise<PropertyUI> => {
    const body = mapToApi(payload);

    const response = files.length > 0
      ? await api.patch<ApiResponse>(`/properties/${id}`, buildFormData(body, files))
      : await api.patch<ApiResponse>(`/properties/${id}`, body);

    const raw =
      response.data?.data?.property ??
      response.data?.data;
    return mapToUI(raw);
  },

  /**
   * ❌ Remover imóvel
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};