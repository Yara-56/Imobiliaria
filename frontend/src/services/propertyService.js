// src/services/propertyService.js
import api from "./api";

/**
 * ==============================
 * LISTAR IMÓVEIS COM FILTROS
 * ==============================
 */
export const listProperties = async (params = {}) => {
  const { data } = await api.get("/properties", { params });
  return data;
};

/**
 * ==============================
 * BUSCAR IMÓVEL POR ID
 * ==============================
 */
export const getPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

/**
 * ==============================
 * FUNÇÃO AUXILIAR PARA FORM DATA
 * ==============================
 * Aceita campos simples + múltiplos arquivos.
 */
const buildFormData = (payload = {}, files = []) => {
  const fd = new FormData();

  /**
   * 🔧 Ajuste importante:
   * Garante que 'bairro' seja sempre enviado corretamente,
   * mesmo que o form ainda use 'district' ou 'neighborhood'.
   */
  const normalized = {
    ...payload,
    bairro: (
      payload.bairro ??
      payload.district ??
      payload.neighborhood ??
      ""
    ).toString().trim(),
  };
  delete normalized.district;       // Evita enviar o campo errado
  delete normalized.neighborhood;   // Evita duplicidade de chave

  // Campos básicos (pule undefined, null **e string vazia**)
  Object.entries(normalized).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const v = String(value);
    if (v.trim() === "") return; // ⬅️ não envia vazio (ex.: bairro="")
    fd.append(key, v);
  });

  // Arquivos (múltiplos)
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
  const { data } = await api.post("/properties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * ==============================
 * ATUALIZAR IMÓVEL (PATCH)
 * ==============================
 */
export const updateProperty = async (id, payload, newFiles = []) => {
  const formData = buildFormData(payload, newFiles);
  const { data } = await api.patch(`/properties/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
  const { data } = await api.post(`/properties/${id}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
