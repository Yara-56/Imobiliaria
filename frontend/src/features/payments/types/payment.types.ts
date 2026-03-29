// ===== TYPES CORE - HOMEFLUX PRO 2026 =====

export interface Tenant {
  id: string; // ✅ No Prisma/Mongo usamos 'id' ou 'id' mapeado do '_id'
  fullName: string;
  email: string;
  phone: string;
}

export interface Contract {
  id: string;
  propertyAddress: string;
  rentAmount: number;
  tenantId: string;
  contractNumber?: string;
  dueDay: number;
}

/**
 * ✅ DEFINIÇÃO DE STATUS (Sincronizado com o Backend/Prisma)
 * Usamos maiúsculo para bater com o Enum do MongoDB.
 */
export type PaymentStatus = "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO";

/**
 * ✅ MÉTODOS DE PAGAMENTO
 */
export type PaymentMethod = "PIX" | "BOLETO" | "DINHEIRO" | "CARTAO" | "TRANSFERENCIA";

export interface Payment {
  id: string;
  tenantId: Tenant | string;
  contractId: Contract | string;
  amount: number;
  discount: number;
  lateFee: number;
  totalAmount: number;
  dueDate: string | Date;
  paymentDate?: string | Date | null; // ✅ Aceita string ou Date para evitar ts(2322)
  status: PaymentStatus;
  method?: PaymentMethod;
  description?: string;
  referenceMonth?: string;
  notes?: string;
  receiptUrl?: string | null; // ✅ URL do PDF gerado pelo backend
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * ✅ DTO PARA CRIAÇÃO/ATUALIZAÇÃO
 */
export interface CreatePaymentDTO {
  tenantId: string;
  contractId: string;
  amount: number;
  discount?: number;
  lateFee?: number;
  dueDate: string | Date; // ✅ Flexível para evitar erros de compilação
  paymentDate?: string | Date | null;
  status: PaymentStatus;
  method?: PaymentMethod;
  description?: string;
  referenceMonth?: string;
  notes?: string;
}