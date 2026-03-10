// frontend/src/features/contracts/api/contract.api.ts

import api from "@/core/api/httpClient";
import type { Contract, CreateContractDTO, UpdateContractDTO } from "../types/contract.types";

interface ApiResponse {
  status?: string;
  data: any;
}

const extractList = (data: any): Contract[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.contracts)) return data.data.contracts;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const contractApi = {
  list: async (): Promise<Contract[]> => {
    const response = await api.get<ApiResponse>("/contracts");
    return extractList(response.data);
  },

  getById: async (id: string): Promise<Contract> => {
    const response = await api.get<ApiResponse>(`/contracts/${id}`);
    return response.data?.data?.contract ?? response.data?.data ?? response.data;
  },

  create: async (payload: CreateContractDTO): Promise<Contract> => {
    const response = await api.post<ApiResponse>("/contracts", payload);
    return response.data?.data?.contract ?? response.data?.data ?? response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Contract> => {
    const response = await api.patch<ApiResponse>(`/contracts/${id}/status`, { status });
    return response.data?.data?.contract ?? response.data?.data ?? response.data;
  },

  update: async (id: string, payload: UpdateContractDTO): Promise<Contract> => {
    const response = await api.patch<ApiResponse>(`/contracts/${id}`, payload);
    return response.data?.data?.contract ?? response.data?.data ?? response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/contracts/${id}`);
  },
};