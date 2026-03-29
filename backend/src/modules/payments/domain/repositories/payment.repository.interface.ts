import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from "../entities/payment.entity.js";

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string; // ✅ Adicionado para buscas por inquilino/mês
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

/**
 * ✅ INTERFACE OFICIAL DO REPOSITÓRIO DE PAGAMENTOS
 * Atualizada para suportar data de pagamento na alteração de status.
 */
export interface IPaymentRepository {
  create(data: CreatePaymentData): Promise<Payment>;
  
  findAll(tenantId: string, query?: PaginationQuery): Promise<Payment[]>;
  
  findById(id: string, tenantId: string): Promise<Payment | null>;
  
  /**
   * ✅ CORREÇÃO: Agora aceita o 4º argumento opcional 'paymentDate'
   * Isso mata o erro ts(2554) no seu Use Case.
   */
  updateStatus(
    id: string, 
    tenantId: string, 
    status: PaymentStatus, 
    paymentDate?: Date // ⬅️ O segredo está aqui!
  ): Promise<Payment>;

  delete(id: string, tenantId: string): Promise<void>;
  
  /**
   * Registro de log de auditoria para mudanças de status financeiros
   */
  createHistory?(data: CreatePaymentHistoryData): Promise<void>;
}