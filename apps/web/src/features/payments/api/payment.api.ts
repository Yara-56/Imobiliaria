import { Payment, CreatePaymentDTO, Tenant, Contract } from "../types/payment.types";
import api from "@/core/api/httpClient";

export const paymentApi = {
  // 💰 PAYMENTS
  getAll: async (): Promise<Payment[]> => {
    const response = await api.get("/payments");
    return response.data.data.payments;
  },

  getById: async (id: string): Promise<Payment> => {
    const response = await api.get(`/payments/${id}`);
    return response.data.data.payment;
  },

  create: async (data: CreatePaymentDTO): Promise<Payment> => {
    const response = await api.post("/payments", data);
    return response.data.data.payment;
  },

  update: async (id: string, data: Partial<CreatePaymentDTO>): Promise<Payment> => {
    const response = await api.patch(`/payments/${id}`, data);
    return response.data.data.payment;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },

  // 🤖 AUTOMAÇÃO (A que faltava!)
  generateAuto: async (contractId: string): Promise<{ count: number }> => {
    const response = await api.post(`/payments/generate/${contractId}`);
    return response.data.data;
  },

  // 🏢 TENANTS (Inquilinos)
  getTenants: async (): Promise<Tenant[]> => {
    const response = await api.get("/tenants");
    return response.data.data.renters;
  },

  // 📄 CONTRACTS
  getContracts: async (): Promise<Contract[]> => {
    const response = await api.get("/contracts");
    return response.data.data.contracts;
  },
};