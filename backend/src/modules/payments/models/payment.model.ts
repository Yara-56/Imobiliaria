import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment {
  contractId: Types.ObjectId;
  tenantId: Types.ObjectId;
  amount: number;
  paymentDate: Date;
  // ✅ Alinhado com o MixPaymentType do Frontend: PIX, BOLETO, CARTAO_RECORRENTE, DINHEIRO
  method: 'PIX' | 'BOLETO' | 'CARTAO_RECORRENTE' | 'DINHEIRO' | 'TRANSFERENCIA';
  status: 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado';
  receiptUrl?: string; 
  notes?: string;
  referenceMonth: string; // Ex: "02/2026"
  owner: Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaymentDocument extends IPayment, Document {}

const PaymentSchema = new Schema<IPaymentDocument>({
  contractId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Contract', 
    required: [true, 'O contrato é obrigatório'] 
  },
  tenantId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: [true, 'O inquilino é obrigatório'] 
  },
  amount: { 
    type: Number, 
    required: [true, 'O valor é obrigatório'], 
    min: [0, 'O valor não pode ser negativo'] 
  },
  paymentDate: { 
    type: Date, 
    required: [true, 'A data de pagamento é obrigatória'],
    default: Date.now 
  },
  method: { 
    type: String, 
    enum: ['PIX', 'BOLETO', 'CARTAO_RECORRENTE', 'DINHEIRO', 'TRANSFERENCIA'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pendente', 'Pago', 'Atrasado', 'Cancelado'], 
    default: 'Pendente' 
  },
  receiptUrl: { type: String }, 
  referenceMonth: { 
    type: String, 
    required: true,
    // ✅ Regex flexível para aceitar MM/AAAA ou o formato de string do Seed
    match: [/^(0[1-9]|1[0-2])\/\d{4}$|^\w+\/\d{4}$/, 'Formato deve ser válido']
  },
  notes: { type: String, maxlength: 500 },
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🛡️ Impede duplicidade de cobrança no mesmo mês
PaymentSchema.index({ contractId: 1, referenceMonth: 1 }, { unique: true });

// ✅ CORREÇÃO TS(2307): Use Named Export para garantir compatibilidade no MacBook
export const Payment = mongoose.model<IPaymentDocument>('Payment', PaymentSchema);