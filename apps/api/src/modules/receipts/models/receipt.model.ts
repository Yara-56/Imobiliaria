import mongoose, { Schema, Document, Types } from "mongoose";
import { multiTenantPlugin } from "@shared/plugins/multi-tenant.plugin.js";

/**
 * 1️⃣ Interface de Dados Pura (POJO)
 * Usada para tipagem no Frontend e Services com .lean()
 */
export interface IReceipt {
  paymentId: Types.ObjectId;
  description?: string;
  tenantId: Types.ObjectId; // 🛡️ Segurança: Isolamento de dados
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 2️⃣ Interface do Documento (Mongoose)
 * Estende a interface de dados e Document para evitar conflito de _id
 */
export interface IReceiptDocument extends IReceipt, Document {}

/**
 * 3️⃣ Definição do Schema
 */
const ReceiptSchema = new Schema<IReceiptDocument>(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    // O campo tenantId é gerenciado pelo multiTenantPlugin
  },
  { timestamps: true }
);

/**
 * 4️⃣ Plugins e Índices
 */
// Aplicação do plugin para garantir o isolamento (Multi-tenancy)
ReceiptSchema.plugin(multiTenantPlugin);

// Índice composto para performance em buscas filtradas
ReceiptSchema.index({ tenantId: 1, createdAt: -1 });

/**
 * 5️⃣ Exportação do Modelo
 */
const Receipt = mongoose.model<IReceiptDocument>("Receipt", ReceiptSchema);
export default Receipt;