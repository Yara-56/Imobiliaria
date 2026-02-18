import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * 1️⃣ Interface de Dados Pura (POJO)
 * Define apenas a estrutura dos dados para uso no Frontend e Services.
 */
export interface IPayment {
  contractId: Types.ObjectId;
  tenantId: Types.ObjectId;
  amount: number;
  paymentDate: Date;
  method: 'Pix' | 'Boleto' | 'Cartão' | 'Dinheiro' | 'Transferência';
  status: 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado';
  receiptUrl?: string; 
  receiptKey?: string; 
  notes?: string;
  referenceMonth: string; // Ex: "02/2026"
  owner: Types.ObjectId; // 🛡️ Cybersecurity: Isolamento (Multi-tenancy)
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 2️⃣ Interface do Documento (Mongoose)
 * Une os dados da interface pura com os métodos do Mongoose (.save, .populate).
 */
export interface IPaymentDocument extends IPayment, Document {}

/**
 * 3️⃣ Definição do Schema com Validações Rigorosas
 */
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
    enum: ['Pix', 'Boleto', 'Cartão', 'Dinheiro', 'Transferência'], 
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
    match: [/^(0[1-9]|1[0-2])\/\d{4}$/, 'Formato deve ser MM/AAAA']
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

/**
 * 4️⃣ Regras de Negócio (Índices)
 * Garante que não haja duplicidade de cobrança no mesmo mês.
 */
PaymentSchema.index({ contractId: 1, referenceMonth: 1 }, { unique: true });

/**
 * 5️⃣ Exportação do Modelo
 */
const Payment = mongoose.model<IPaymentDocument>('Payment', PaymentSchema);
export default Payment;