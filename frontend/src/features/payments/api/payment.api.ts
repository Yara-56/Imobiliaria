import api from "@/core/api/api";
// ✅ Corrigido: Importando do arquivo HUB (mix) e não apenas do método PIX
import type { Payment, CreatePaymentDTO, UpdatePaymentDTO } from "../types/mix.payment.type.js";

interface ApiResponse<T> {
  status: string;
  data: T;
}

/**
 * 🛡️ PAYMENT API - CLUSTER FINANCEIRO AURA
 * Suporta múltiplos métodos (PIX, DINHEIRO, RECORRÊNCIA) de forma inteligente.
 */
export const paymentApi = {
  list: async (): Promise<Payment[]> => {
    const { data } = await api.get<ApiResponse<{ payments: Payment[] }>>("/payments");
    return data.data.payments;
  },

  create: async (payload: CreatePaymentDTO): Promise<Payment> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (key === "receiptFile" && value instanceof File) {
        formData.append("receipt", value);
      } else if (typeof value === "object") {
        // ✅ Inteligência para enviar os detalhes (PIX/Recorrência) como string
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    const { data } = await api.post<ApiResponse<{ payment: Payment }>>("/payments", formData);
    return data.data.payment;
  },

  update: async (id: string, payload: UpdatePaymentDTO): Promise<Payment> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (key === "receiptFile" && value instanceof File) {
        formData.append("receipt", value);
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    const { data } = await api.patch<ApiResponse<{ payment: Payment }>>(`/payments/${id}`, formData);
    return data.data.payment;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/payments/${id}`);
  }
};