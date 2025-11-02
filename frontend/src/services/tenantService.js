import api from "./api";

/**
 * ==============================
 * LISTAR INQUILINOS
 * ==============================
 */
export const listTenants = async (query = "") => {
  const { data } = await api.get("/tenants", { params: { q: query } });
  return data.items ?? [];
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
