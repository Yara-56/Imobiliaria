import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * 1️⃣ Interface de Dados Pura (POJO)
 * Centraliza a estrutura para o Frontend (React) e o Backend (NodeNext).
 */
export interface IPayment {
  contractId: Types.ObjectId;
  tenantId: Types.ObjectId;
  amount: number;
  paymentDate: Date;
  method: 'Pix' | 'Boleto' | 'Cartão' | 'Dinheiro' | 'Transferência';
  status: 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado';
  receiptUrl?: string; 
  notes?: string;
  referenceMonth: string; // Ex: "02/2026"
  owner: Types.ObjectId; // 🛡️ Cybersecurity: Isolamento de dados (Multi-tenancy)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaymentDocument extends IPayment, Document {}

/**
 * 2️⃣ Definição do Schema com Validações Rigorosas
 * O uso de 'match' no referenceMonth garante a padronização no MongoDB.
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
    index: true // ✅ Otimiza buscas por admin logado no seu MacBook
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * 3️⃣ Regras de Negócio (Índices)
 * 🛡️ Impede que o mesmo contrato gere dois pagamentos no mesmo mês.
 */
PaymentSchema.index({ contractId: 1, referenceMonth: 1 }, { unique: true });



/**
 * 4️⃣ Exportação do Modelo
 */
const Payment = mongoose.model<IPaymentDocument>('Payment', PaymentSchema);
export default Payment;