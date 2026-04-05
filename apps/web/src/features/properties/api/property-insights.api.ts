import { http as api } from "../../../lib/http";
import { PropertyInsights } from "../types/property-insights.types";

/**
 * ✅ API DE INSIGHTS DE PROPRIEDADES
 * Responsável por buscar os dados resumidos para o Dashboard.
 */
export const propertyInsightsApi = {
  /**
   * Busca o resumo estatístico das propriedades da imobiliária (tenant)
   */
  get: async (): Promise<PropertyInsights> => {
    try {
      // Faz a requisição para a rota que criamos no backend
      const response = await api.get("/v1/properties/insights");

      // No seu backend, o padrão de resposta costuma ser { status: "success", data: { ... } }
      // Se o seu axios já retorna o 'data', usamos response.data.data
      return response.data.data;
      
    } catch (error: any) {
      console.error("❌ Erro ao buscar insights de propriedades:", error);
      throw error; // Deixa o React Query tratar o erro
    }
  },

  /**
   * Exemplo: Busca evolução histórica (se necessário no futuro)
   */
  getHistory: async (months = 6): Promise<any> => {
    const response = await api.get(`/v1/properties/insights/history?months=${months}`);
    return response.data.data;
  }
};