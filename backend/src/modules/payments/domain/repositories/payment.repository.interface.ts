import {
    Payment,
    PaymentStatus,
    PaymentMethod,
  } from "../entities/payment.entity.js";
  
  export interface PaginationQuery {
    page?: number;
    limit?: number;
  }
  
  export interface CreatePaymentData {
    amount: number;
    referenceMonth: string;
    dueDate: Date;
    method: PaymentMethod;
    contractId: string;
    tenantId: string;
    userId: string;
    paymentDate?: Date | null;
    status?: PaymentStatus;
    receiptUrl?: string | null;
    notes?: string | null;
  }
  
  export interface CreatePaymentHistoryData {
    paymentId: string;
    previousStatus: PaymentStatus;
    newStatus: PaymentStatus;
    changedAt: Date;
  }
  
  // ✅ O NOME DEVE SER EXATAMENTE ESTE:
  export interface IPaymentRepository {
    create(data: CreatePaymentData): Promise<Payment>;
    findAll(tenantId: string, query?: PaginationQuery): Promise<Payment[]>;
    findById(id: string, tenantId: string): Promise<Payment | null>;
    updateStatus(id: string, tenantId: string, status: PaymentStatus): Promise<Payment>;
    delete(id: string, tenantId: string): Promise<void>;
    createHistory?(data: CreatePaymentHistoryData): Promise<void>;
  }