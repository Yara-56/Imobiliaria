/**
 * ====================================================
 * Centralização de endpoints da API
 * Evita strings espalhadas no sistema
 * ====================================================
 */

export const endpoints = {
    /**
     * ------------------------------------------------
     * AUTH
     * ------------------------------------------------
     */
    auth: {
      login: "/auth/login",
      logout: "/auth/logout",
      refresh: "/auth/refresh",
      me: "/auth/me",
    },
  
    /**
     * ------------------------------------------------
     * USERS
     * ------------------------------------------------
     */
    users: {
      list: "/users",
      create: "/users",
      getById: (id: string) => `/users/${id}`,
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
  
    /**
     * ------------------------------------------------
     * TENANTS (INQUILINOS)
     * ------------------------------------------------
     */
    tenants: {
      list: "/tenants",
      create: "/tenants",
      getById: (id: string) => `/tenants/${id}`,
      update: (id: string) => `/tenants/${id}`,
      delete: (id: string) => `/tenants/${id}`,
    },
  
    /**
     * ------------------------------------------------
     * PROPERTIES (IMÓVEIS)
     * ------------------------------------------------
     */
    properties: {
      list: "/properties",
      create: "/properties",
      getById: (id: string) => `/properties/${id}`,
      update: (id: string) => `/properties/${id}`,
      delete: (id: string) => `/properties/${id}`,
    },
  
    /**
     * ------------------------------------------------
     * CONTRACTS (CONTRATOS)
     * ------------------------------------------------
     */
    contracts: {
      list: "/contracts",
      create: "/contracts",
      getById: (id: string) => `/contracts/${id}`,
      update: (id: string) => `/contracts/${id}`,
      delete: (id: string) => `/contracts/${id}`,
    },
  
    /**
     * ------------------------------------------------
     * PAYMENTS (PAGAMENTOS)
     * ------------------------------------------------
     */
    payments: {
      list: "/payments",
      create: "/payments",
      getById: (id: string) => `/payments/${id}`,
      update: (id: string) => `/payments/${id}`,
      delete: (id: string) => `/payments/${id}`,
  
      /**
       * ações específicas
       */
      markAsPaid: (id: string) => `/payments/${id}/pay`,
      history: (id: string) => `/payments/${id}/history`,
    },
  
    /**
     * ------------------------------------------------
     * DASHBOARD
     * ------------------------------------------------
     */
    dashboard: {
      summary: "/dashboard/summary",
      stats: "/dashboard/stats",
    },
  
    /**
     * ------------------------------------------------
     * HEALTH CHECK
     * ------------------------------------------------
     */
    system: {
      health: "/health",
    },
  } as const;
  
  export default endpoints;