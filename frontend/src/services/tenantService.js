// src/services/tenantService.js
import api from "./api";

/**
 * ==============================
 * LISTAR INQUILINOS (com filtros opcionais)
 * ==============================
 */
export const listTenants = async (params = {}) => {
  const { data } = await api.get("/tenants", { params });
  return data;
};

/**
 * ==============================
 * OBTER INQUILINO POR ID
 * ==============================
 */
export const getTenantById = async (id) => {
  const { data } = await api.get(`/tenants/${id}`);
  return data;
};

/**
 * ==============================
 * CRIAR INQUILINO
 * ==============================
 */
export const createTenant = async (payload) => {
  const { data } = await api.post("/tenants", payload);
  return data;
};

/**
 * ==============================
 * ATUALIZAR INQUILINO
 * ==============================
 */
export const updateTenant = async (id, payload) => {
  const { data } = await api.put(`/tenants/${id}`, payload);
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
