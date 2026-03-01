import mongoose, { Schema, Document, Types } from "mongoose";
// ✅ Usando Alias profissional e extensão .js obrigatória
import { multiTenantPlugin } from "@shared/plugins/multiTenant.plugin.js";

/**
 * 1️⃣ Interface de Dados Pura (POJO)
 * Define a estrutura para uso no Frontend e Services com .lean().
 */
export interface ITemplate {
  title: string;
  content: string; // HTML ou Markdown do contrato/recibo
  tenantId: Types.ObjectId; // 🛡️ Segurança: Isolamento de dados
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 2️⃣ Interface do Documento (Mongoose)
 * Estende a interface de dados e a classe Document para evitar conflitos de _id.
 */
export interface ITemplateDocument extends ITemplate, Document {}

/**
 * 3️⃣ Definição do Schema
 */
const TemplateSchema = new Schema<ITemplateDocument>(
  {
    title: {
      type: String,
      required: [true, "O título do template é obrigatório"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "O conteúdo do template é obrigatório"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // O campo tenantId é injetado e gerenciado pelo multiTenantPlugin
  },
  { timestamps: true }
);

/**
 * 4️⃣ Plugins e Índices
 */
// Aplicação do plugin para garantir o isolamento automático (Multi-tenancy)
TemplateSchema.plugin(multiTenantPlugin);

// Índice composto para performance em buscas filtradas por tenant
TemplateSchema.index({ tenantId: 1, title: 1 });

/**
 * 5️⃣ Exportação do Modelo
 */
const Template = mongoose.model<ITemplateDocument>("Template", TemplateSchema);
export default Template;