import { Payment, CreatePaymentDTO, Tenant, Contract } from "../types/payment.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const paymentApi = {
  // PAYMENTS
  getAll: async (): Promise<Payment[]> => {
    const res = await fetch(`${API_URL}/payments`);
    return res.json();
  },

  getById: async (id: string): Promise<Payment> => {
    const res = await fetch(`${API_URL}/payments/${id}`);
    return res.json();
  },

  create: async (data: CreatePaymentDTO): Promise<Payment> => {
    const res = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id: string, data: Partial<CreatePaymentDTO>): Promise<Payment> => {
    const res = await fetch(`${API_URL}/payments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/payments/${id}`, { method: "DELETE" });
  },

  // TENANTS
  getTenants: async (): Promise<Tenant[]> => {
    const res = await fetch(`${API_URL}/tenants`);
    return res.json();
  },

  // CONTRACTS
  getContracts: async (): Promise<Contract[]> => {
    const res = await fetch(`${API_URL}/contracts`);
    return res.json();
  },
};