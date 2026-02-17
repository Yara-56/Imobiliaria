import mongoose, { Schema, Document, Types } from 'mongoose';
import { multiTenantPlugin } from "../../shared/plugins/multiTenant.plugin.js";

// Interface para garantir consistência em todo o backend
export interface IReceipt extends Document {
  paymentId: Types.ObjectId;
  description?: string;
  tenantId: Types.ObjectId; // 🛡️ Segurança: Isolamento de dados
  createdAt: Date;
}

const ReceiptSchema = new Schema<IReceipt>({
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  // O campo tenantId será injetado e gerenciado pelo plugin
}, { timestamps: true });

// Aplicação do plugin para garantir que o recibo pertença ao admin logado
ReceiptSchema.plugin(multiTenantPlugin);

// Índice para busca rápida de recibos por corretor
ReceiptSchema.index({ tenantId: 1, createdAt: -1 });

export default mongoose.model<IReceipt>('Receipt', ReceiptSchema);