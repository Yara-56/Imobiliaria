// ─────────────────────────────────────────────
// ENUMS DE RUNTIME
// ─────────────────────────────────────────────

export const PAYMENT_METHOD = {
  PIX: "PIX",
  BOLETO: "BOLETO",
  CARTAO_RECORRENTE: "CARTAO_RECORRENTE",
  DINHEIRO: "DINHEIRO",
  TRANSFERENCIA: "TRANSFERENCIA",
} as const;

export const PAYMENT_STATUS = {
  PENDENTE: "PENDENTE",
  PAGO: "PAGO",
  ATRASADO: "ATRASADO",
  CANCELADO: "CANCELADO",
} as const;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// ─────────────────────────────────────────────
// ENTITY
// ─────────────────────────────────────────────

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

  contractId: string;
  tenantId: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}

// helpers
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