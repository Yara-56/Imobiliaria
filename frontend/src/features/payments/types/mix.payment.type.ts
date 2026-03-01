// ✅ Verifique se o caminho relativo está correto: ./methods/
import { PixPayment } from "./methods/pix.payment.type.js";
import { RecurrentPayment } from "./methods/recurrent.payment.type.js";
import { CashPayment } from "./methods/cash.payment.type.js";

export type PaymentMethodType = "PIX" | "BOLETO" | "CARTAO_RECORRENTE" | "DINHEIRO";

export interface Payment {
  _id: string;
  amount: number;
  referenceMonth: string;
  dueDate: string;
  status: "Pendente" | "Pago" | "Atrasado" | "Cancelado";
  method: PaymentMethodType;
  
  tenantId: { 
    _id: string; 
    fullName: string; 
  };
  contractId: { 
    _id: string; 
    propertyAddress: string; 
  };

  details?: PixPayment | RecurrentPayment | CashPayment;
  
  createdAt: string;
  updatedAt?: string;
}

export type CreatePaymentDTO = Omit<Payment, "_id" | "createdAt" | "tenantId" | "contractId"> & {
  tenantId: string;
  contractId: string;
};

export type UpdatePaymentDTO = Partial<CreatePaymentDTO>;