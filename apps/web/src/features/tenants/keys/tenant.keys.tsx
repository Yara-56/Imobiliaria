/**
 * ======================================================
 * 🔑 TENANT QUERY KEYS
 * ======================================================
 * Padronização de chaves para gerenciamento de cache no React Query.
 * Segue o padrão: [entidade, escopo, parâmetros]
 */

export const tenantKeys = {
    // Chave base para tudo relacionado a inquilinos
    all: ["tenants"] as const,
  
    // Chave para todas as listagens (útil para invalidar todas as buscas de uma vez)
    lists: () => [...tenantKeys.all, "list"] as const,
  
    // Chave específica para uma listagem com filtros
    list: (filters: Record<string, any> = {}) => 
      [...tenantKeys.lists(), { ...filters }] as const,
  
    // Chave base para detalhes de um inquilino único
    details: () => [...tenantKeys.all, "detail"] as const,
  
    // Chave para o detalhe de um ID específico
    detail: (id: string) => [...tenantKeys.details(), id] as const,
  
    // Chaves para escopos específicos (ex: estatísticas do dashboard se houver)
    stats: () => [...tenantKeys.all, "stats"] as const,
  };