/**
 * ✅ PROPERTY INSIGHTS QUERY KEYS
 * Padronização de chaves para cache do TanStack Query v5+.
 * Centralizar aqui evita inconsistências no invalidateQueries.
 */

export const propertyInsightsKeys = {
    // Chave base para tudo relacionado a insights
    all: ['property-insights'] as const,
    
    // Chave específica para a listagem/resumo geral
    list: () => [...propertyInsightsKeys.all, 'list'] as const,
    
    // Chave para insights filtrados (ex: por período ou categoria)
    filter: (filters: Record<string, unknown>) => [...propertyInsightsKeys.all, 'list', { filters }] as const,
    
    // Chave para detalhe de um insight específico (se houver)
    detail: (id: string) => [...propertyInsightsKeys.all, 'detail', id] as const,
  };