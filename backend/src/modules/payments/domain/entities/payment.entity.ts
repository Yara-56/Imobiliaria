export type PaymentMethod = "PIX" | "BOLETO" | "CARTAO_RECORRENTE" | "DINHEIRO" | "TRANSFERENCIA";
export type PaymentStatus = "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO";

export interface Payment {
  id: string;
  amount: number;
  paymentDate: Date;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptUrl?: string;
  notes?: string;
  referenceMonth: string;
  contractId: string;
  tenantId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}