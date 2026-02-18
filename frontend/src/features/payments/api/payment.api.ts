import api from "@/core/api/api";
import type { Payment, CreatePaymentDTO, UpdatePaymentDTO } from "../types/payment.type.js";

interface ApiResponse<T> {
  status: string;
  data: T;
}

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
      } else {
        formData.append(key, String(value)); // ✅ Resolve erro de sobrecarga
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