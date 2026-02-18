export type PaymentStatus = "Pendente" | "Pago" | "Atrasado" | "Cancelado";

export interface Payment {
  _id: string;
  amount: number;
  referenceMonth: string;
  dueDate: string;
  status: PaymentStatus;
  tenantId?: { _id: string; fullName: string };
  contractId?: { _id: string; propertyAddress: string };
  receiptUrl?: string;
  createdAt: string;
}

export type CreatePaymentDTO = {
  amount: number;
  referenceMonth: string;
  dueDate: string;
  status: PaymentStatus;
  tenantId: string;
  contractId: string;
  receiptFile?: File; 
};

export type UpdatePaymentDTO = Partial<CreatePaymentDTO>;