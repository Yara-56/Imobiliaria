// frontend/src/features/contracts/api/contract.api.ts
import api from "@/core/api/apiResponse";
import type { 
  Contract, 
  CreateContractDTO, 
  UpdateContractDTO, 
  ContractStatus 
} from "../types/contract.types";

export const contractApi = {
  // Lista todos os contratos
  list: async (): Promise<Contract[]> => {
    const response = await api.get("/contracts");
    // Ajuste conforme a estrutura que o seu backend retornar
    return response.data?.data?.contracts || [];
  },

  // Busca um contrato específico
  getById: async (id: string): Promise<Contract> => {
    const response = await api.get(`/contracts/${id}`);
    return response.data?.data?.contract;
  },

  // Cria um novo contrato
  create: async (data: CreateContractDTO): Promise<Contract> => {
    const response = await api.post("/contracts", data);
    return response.data?.data?.contract;
  },

  // Atualiza apenas o status
  updateStatus: async (id: string, status: ContractStatus): Promise<Contract> => {
    const response = await api.patch(`/contracts/${id}/status`, { status });
    return response.data?.data?.contract;
  },

  // Deleta um contrato
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contracts/${id}`);
  }
};