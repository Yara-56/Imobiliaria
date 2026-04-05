// src/features/contracts/api/contract.api.ts
import { http } from "@/lib/http";
import { mapApiToContract, mapContractToApi } from "../mappers/contract.mapper";
import type { 
  Contract, 
  CreateContractDTO, 
  UpdateContractDTO, 
  ContractStatus 
} from "../types/contract.types";

export const contractApi = {
  /**
   * Listar todos os contratos
   */
  list: async (filters?: Record<string, any>): Promise<Contract[]> => {
    try {
      const { data } = await http.get<any[]>("/contracts", {
        params: filters,
      });
      // O backend costuma retornar { data: { contracts: [] } } ou só o array
      const rawContracts = Array.isArray(data) ? data : (data as any).contracts || [];
      return rawContracts.map(mapApiToContract);
    } catch (error) {
      console.error("Erro ao listar contratos:", error);
      throw new Error("Não foi possível carregar a lista de contratos.");
    }
  },

  /**
   * Buscar contrato por ID
   */
  getById: async (id: string): Promise<Contract> => {
    try {
      const { data } = await http.get<any>(`/contracts/${id}`);
      return mapApiToContract(data);
    } catch (error) {
      console.error(`Erro ao buscar contrato ${id}:`, error);
      throw new Error("Contrato não encontrado.");
    }
  },

  /**
   * Criar novo contrato
   */
  create: async (payload: CreateContractDTO): Promise<Contract> => {
    try {
      const apiPayload = mapContractToApi(payload);
      const { data } = await http.post<any>("/contracts", apiPayload);
      return mapApiToContract(data);
    } catch (error: any) {
      console.error("Erro ao criar contrato:", error);
      const errorMessage = error?.response?.data?.message || "Erro ao gerar contrato imobiliário.";
      throw new Error(errorMessage);
    }
  },

  /**
   * Atualizar status do contrato (Ativar/Cancelar)
   */
  updateStatus: async (id: string, status: ContractStatus): Promise<Contract> => {
    try {
      const { data } = await http.patch<any>(`/contracts/${id}/status`, { status });
      return mapApiToContract(data);
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      throw new Error("Falha ao atualizar situação do contrato.");
    }
  },

  /**
   * Atualizar dados do contrato
   */
  update: async (id: string, payload: UpdateContractDTO): Promise<Contract> => {
    try {
      const { data } = await http.put<any>(`/contracts/${id}`, payload);
      return mapApiToContract(data);
    } catch (error: any) {
      console.error("Erro ao atualizar contrato:", error);
      throw new Error("Erro ao salvar alterações do contrato.");
    }
  },

  /**
   * Deletar contrato
   */
  delete: async (id: string): Promise<void> => {
    try {
      await http.delete(`/contracts/${id}`);
    } catch (error) {
      console.error("Erro ao deletar contrato:", error);
      throw new Error("Não foi possível excluir o contrato.");
    }
  },
};