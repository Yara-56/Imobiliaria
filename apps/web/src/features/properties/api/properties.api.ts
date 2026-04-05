import api from "../../../../../src/core/api/httpClient";

import {
  mapApiToProperty as mapToUI,
  mapPropertyToApi as mapToApi
} from "@/features/properties/mappers/properties.mapper";

import type { Property, PropertyUI } from "../types/property";

/**
 * Extrai um campo seguro do response da API
 */
function extract<T>(res: any, field: string): T {
  return res?.data?.data?.[field];
}

export const propertiesApi = {
  /**
   * Lista propriedades
   */
  async list(params?: any): Promise<PropertyUI[]> {
    const res = await api.get("/properties", { params });

    // Corrigido — tipagem explícita
    const list = extract<Property[]>(res, "properties") ?? [];

    return list.map(mapToUI);
  },

  /**
   * Busca por ID
   */
  async getById(id: string): Promise<PropertyUI | null> {
    const res = await api.get(`/properties/${id}`);

    // Corrigido — tipagem explícita
    const item = extract<Property>(res, "property");

    return item ? mapToUI(item) : null;
  },

  /**
   * Cria propriedade
   */
  async create(
    payload: Partial<PropertyUI>,
    files: File[] = []
  ): Promise<PropertyUI> {
    const body = mapToApi(payload);

    // Se tem arquivos → usa FormData
    let data: any = body;

    if (files.length > 0) {
      const form = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value as any);
        }
      });

      files.forEach((file) => form.append("documents", file));

      data = form;
    }

    const res = await api.post("/properties", data);
    const item = extract<Property>(res, "property");

    return mapToUI(item);
  },

  /**
   * Atualiza propriedade
   */
  async update(
    id: string,
    payload: Partial<PropertyUI>,
    files: File[] = []
  ): Promise<PropertyUI> {
    const body = mapToApi(payload);

    let data: any = body;

    if (files.length > 0) {
      const form = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value as any);
        }
      });

      files.forEach((file) => form.append("documents", file));

      data = form;
    }

    const res = await api.patch(`/properties/${id}`, data);
    const item = extract<Property>(res, "property");

    return mapToUI(item);
  },

  /**
   * Remove propriedade
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  }
};