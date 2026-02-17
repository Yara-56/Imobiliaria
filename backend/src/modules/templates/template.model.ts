import mongoose, { Schema, Document, Types } from 'mongoose';
import { multiTenantPlugin } from "../../shared/plugins/multiTenant.plugin.js";

// Interface para garantir que o TS reconheça os campos do Template
export interface ITemplate extends Document {
  title: string;
  content: string; // HTML ou Markdown do contrato/recibo
  tenantId: Types.ObjectId; // 🛡️ Segurança: Isolamento de dados
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Aplicação do plugin para garantir o multi-tenancy automático
TemplateSchema.plugin(multiTenantPlugin);

// Índice para performance na busca de templates por dono
TemplateSchema.index({ tenantId: 1, title: 1 });

export default mongoose.model<ITemplate>('Template', TemplateSchema);