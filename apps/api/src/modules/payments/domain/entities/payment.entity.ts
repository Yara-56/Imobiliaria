/**
 * ─────────────────────────────────────────────
 * ENUMS DE RUNTIME (International Standard)
 * ─────────────────────────────────────────────
 */
export const PAYMENT_METHOD = {
  PIX: "PIX",
  BOLETO: "BOLETO",
  RECURRING_CARD: "RECURRING_CARD", // ✅ Substituiu CARTAO_RECORRENTE
  CASH: "CASH",                     // ✅ Substituiu DINHEIRO
  TRANSFER: "TRANSFER",             // ✅ Substituiu TRANSFERENCIA
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",     // ✅ Substituiu PENDENTE
  PAID: "PAID",           // ✅ Substituiu PAGO
  OVERDUE: "OVERDUE",     // ✅ Substituiu ATRASADO
  CANCELLED: "CANCELLED", // ✅ Substituiu CANCELADO
} as const;

/**
 * ─────────────────────────────────────────────
 * TYPES
 * ─────────────────────────────────────────────
 */
export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/**
 * ─────────────────────────────────────────────
 * ENTITY
 * ─────────────────────────────────────────────
 */
export interface Payment {
  id: string;

  amount: number;
  referenceMonth: string;
  dueDate: Date;
  paymentDate?: Date | null;

  method: PaymentMethod;
  status: PaymentStatus;

  receiptUrl?: string | null;
  notes?: string | null;
  daysOverdue: number; // ✅ Adicionado para bater com o Schema

  contractId: string;
  tenantId: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * ─────────────────────────────────────────────
 * HELPERS
 * ─────────────────────────────────────────────
 */
export const PaymentStatusValues = Object.values(PAYMENT_STATUS);
export const PaymentMethodValues = Object.values(PAYMENT_METHOD);

export function isValidPaymentStatus(
  status: string
): status is PaymentStatus {
  return PaymentStatusValues.includes(status as PaymentStatus);
}

export function isValidPaymentMethod(
  method: string
): method is PaymentMethod {
  return PaymentMethodValues.includes(method as PaymentMethod);
}