import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface expandida para o mundo real
export interface IPayment extends Document {
  contractId: Types.ObjectId;
  tenantId: Types.ObjectId;
  amount: number;
  paymentDate: Date;
  method: 'Pix' | 'Boleto' | 'Cartão' | 'Dinheiro' | 'Transferência';
  status: 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado';
  
  // ✅ Suporte a Comprovantes (PDF/Imagens)
  receiptUrl?: string; 
  receiptKey?: string; // Útil se você usar AWS S3/Cloudflare R2 no futuro
  
  // ✅ Metadados de Auditoria
  notes?: string;
  referenceMonth: string; // Ex: "02/2026" (Facilita relatórios para sua avó)
  
  // 🛡️ Isolamento de Segurança (Cybersecurity)
  owner: Types.ObjectId; 
  tenantId_Admin: Types.ObjectId; // Vincula à imobiliária específica
}

const PaymentSchema = new Schema<IPayment>({
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
  
  // ✅ Campos de Documentação Digital
  receiptUrl: { type: String }, 
  referenceMonth: { 
    type: String, 
    required: true,
    match: [/^(0[1-9]|1[0-2])\/\d{4}$/, 'Formato de mês de referência deve ser MM/AAAA']
  },
  notes: { type: String, maxlength: 500 },

  // 🛡️ Segurança: Multi-tenancy
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // Melhora a performance de busca no MacBook
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índice Composto: Garante que não haja dois pagamentos iguais para o mesmo contrato no mesmo mês
PaymentSchema.index({ contractId: 1, referenceMonth: 1 }, { unique: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);