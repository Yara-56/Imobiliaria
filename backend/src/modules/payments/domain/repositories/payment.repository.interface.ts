import { Payment, PaymentStatus } from "../entities/payment.entity.js";

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export type CreatePaymentData = Omit<Payment, "id" | "createdAt" | "updatedAt">;

export interface IPaymentRepository {
  create(data: CreatePaymentData): Promise<Payment>;
  findAll(tenantId: string, query?: PaginationQuery): Promise<Payment[]>;
  findById(id: string, tenantId: string): Promise<Payment | null>;
  updateStatus(id: string, tenantId: string, status: PaymentStatus): Promise<Payment>;
  delete(id: string, tenantId: string): Promise<void>;
}