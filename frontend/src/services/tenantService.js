import api from "./api";

/**
 * ==============================
 * LISTAR INQUILINOS
 * ==============================
 */
// 🔑 CORREÇÃO: Aceita um objeto { q } para a busca e processa o retorno como Array direto.
export const listTenants = async ({ q = "" } = {}) => {
  const { data } = await api.get("/tenants", { params: { q } });
  
  // A API retorna o array diretamente (ex: [...]), não { items: [...] }
  // Retorna 'data' se for um Array, ou 'data.items' se a API mudar no futuro.
  return Array.isArray(data) ? data : data?.items ?? [];
};

/**
 * ==============================
 * OBTER INQUILINO POR ID
 * ==============================
 */
export const getTenant = async (id) => {
  const { data } = await api.get(`/tenants/${id}`);
  return data;
};

/**
 * ==============================
 * CRIAR INQUILINO
 * ==============================
 */
export const createTenant = async (payload, files = []) => {
  // 🔑 CORREÇÃO 400 Bad Request: Envia como JSON se não houver arquivos.
  if (!files || files.length === 0) {
    const { data } = await api.post("/tenants", payload);
    return data;
  }

  // Se houver arquivos, usa FormData (multipart/form-data)
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value != null) formData.append(key, value);
  });
  (files || []).forEach((file) => formData.append("documents[]", file));

  const { data } = await api.post("/tenants", formData);
  return data;
};

/**
 * ==============================
 * ATUALIZAR INQUILINO
 * ==============================
 */
export const updateTenant = async (id, payload, files = []) => {
  // 🔑 CORREÇÃO 400 Bad Request: Envia como JSON se não houver novos arquivos.
  if (!files || files.length === 0) {
    const { data } = await api.put(`/tenants/${id}`, payload);
    return data;
  }
  
  // Se houver arquivos, usa FormData.
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value != null) formData.append(key, value);
  });
  (files || []).forEach((file) => formData.append("documents[]", file));

  const { data } = await api.put(`/tenants/${id}`, formData);
  return data;
};

/**
 * ==============================
 * DELETAR INQUILINO
 * ==============================
 */
export const deleteTenant = async (id) => {
  const { data } = await api.delete(`/tenants/${id}`);
  return data;
};