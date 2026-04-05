import { Payment, CreatePaymentDTO, Tenant, Contract } from "../types/payment.types";

// Usando a porta 3001 que vi no seu terminal do backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/v1";

export const paymentApi = {
  // 💰 PAYMENTS
  getAll: async (): Promise<Payment[]> => {
    const res = await fetch(`${API_URL}/payments`);
    const json = await res.json();
    return json.data.payments; // Acessando a estrutura do seu backend
  },

  getById: async (id: string): Promise<Payment> => {
    const res = await fetch(`${API_URL}/payments/${id}`);
    const json = await res.json();
    return json.data.payment;
  },

  create: async (data: CreatePaymentDTO): Promise<Payment> => {
    const res = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data.payment;
  },

  update: async (id: string, data: Partial<CreatePaymentDTO>): Promise<Payment> => {
    // Usando PATCH para bater com o seu Controller
    const res = await fetch(`${API_URL}/payments/${id}`, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data.payment;
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/payments/${id}`, { method: "DELETE" });
  },

  // 🤖 AUTOMAÇÃO (A que faltava!)
  generateAuto: async (contractId: string): Promise<{ count: number }> => {
    const res = await fetch(`${API_URL}/payments/generate/${contractId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    return json.data; // Retorna o count de parcelas geradas
  },

  // 🏢 TENANTS (Inquilinos)
  getTenants: async (): Promise<Tenant[]> => {
    const res = await fetch(`${API_URL}/tenants`);
    const json = await res.json();
    return json.data.renters; // No seu backend a lista chama 'renters'
  },

  // 📄 CONTRACTS
  getContracts: async (): Promise<Contract[]> => {
    const res = await fetch(`${API_URL}/contracts`);
    const json = await res.json();
    return json.data.contracts;
  },
};