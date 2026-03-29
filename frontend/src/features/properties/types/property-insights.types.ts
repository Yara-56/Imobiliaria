/**
 * ✅ PROPERTY INSIGHTS TYPES - HOMEFLUX 2026 🚀
 * Sincronizado com o componente SmartInsightsProperties e o Backend.
 */

export interface PropertyInsights {
    // --- Dados Básicos de Quantidade ---
    totalProperties: number;      // Total de imóveis no sistema
    available: number;            // ✅ Bate com o componente (Imóveis vagos)
    rentedProperties: number;     // Imóveis com inquilino
    maintenance: number;          // ✅ Bate com o componente (Em reforma)
  
    // --- Inteligência e Performance ---
    occupancyRate: number;        // Taxa de ocupação (ex: 92.5)
    lowDemandProperties: number;  // ✅ Bate com o componente (Parados há > 90 dias)
    soonExpiringContracts: number; // ✅ Bate com o componente (Vencem em breve)
  
    // --- Financeiro ---
    totalRentValue: number;       // ✅ Bate com o componente (Soma dos aluguéis)
    monthlyRevenue: number;       // Faturamento bruto real do mês
    pendingPayments: number;      // Total em R$ de aluguéis atrasados
    
    // --- Gráficos e Históricos ---
    revenueHistory: {
      month: string;
      value: number;
    }[];
  }
  
  /**
   * Interface para os Cards individuais do Dashboard
   */
  export interface InsightCardProps {
    title: string;
    value: string | number;
    icon: any; // Aceita LucideIcon ou Componente Chakra
    color: string;
    helpText?: string;
    percentage?: number;
  }
  
  // ✅ Garante que o TypeScript identifique este arquivo como um módulo
  export {};