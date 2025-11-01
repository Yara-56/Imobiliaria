// src/services/propertyService.js
import api from "./api";

// ... (as funções listProperties e getPropertyById estão perfeitas) ...
export const listProperties = async (params = {}) => {
  const { data } = await api.get("/properties", { params });
  return data;
};

export const getPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

// ... (a função buildFormData está perfeita) ...
const buildFormData = (payload = {}, files = []) => {
  const fd = new FormData();
  const normalized = {
    ...payload,
    bairro: (
      payload.bairro ??
      payload.district ??
      payload.neighborhood ??
      ""
    ).toString().trim(),
  };
  delete normalized.district;
  delete normalized.neighborhood;

  Object.entries(normalized).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const v = String(value);
    if (v.trim() === "") return;
    fd.append(key, v);
  });

  (files || []).forEach((file) => {
    fd.append("documents[]", file);
  });

  return fd;
};

/**
 * ==============================
 * CRIAR IMÓVEL (COM OU SEM DOCS)
 * ==============================
 */
export const createProperty = async (payload, files = []) => {
  const formData = buildFormData(payload, files);
  // ✅ REMOVIDO o header manual. O api.js cuida disso.
  const { data } = await api.post("/properties", formData);
  return data;
};

/**
 * ==============================
 * ATUALIZAR IMÓVEL (PATCH)
 * ==============================
 */
export const updateProperty = async (id, payload, newFiles = []) => {
  const formData = buildFormData(payload, newFiles);
  // ✅ REMOVIDO o header manual. O api.js cuida disso.
  const { data } = await api.patch(`/properties/${id}`, formData);
  return data;
};

/**
 * ==============================
 * DELETAR IMÓVEL COMPLETO
 * ==============================
 */
export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
};

/**
 * ==============================
 * ADICIONAR DOCUMENTOS AO IMÓVEL
 * ==============================
 */
export const addPropertyDocuments = async (id, newFiles = []) => {
  const formData = new FormData();
  (newFiles || []).forEach((file) => {
    formData.append("documents[]", file);
  });
  // ✅ REMOVIDO o header manual. O api.js cuida disso.
  const { data } = await api.post(`/properties/${id}/documents`, formData);
  return data;
};

/**
 * ==============================
 * DELETAR DOCUMENTO ESPECÍFICO
 * ==============================
 */
export const deletePropertyDocument = async (id, docId) => {
  const { data } = await api.delete(`/properties/${id}/documents/${docId}`);
  return data;
};