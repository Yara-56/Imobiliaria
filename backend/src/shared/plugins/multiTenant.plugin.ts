import mongoose, { Schema, Document, Query } from "mongoose";
import { AppError } from "../errors/AppError.js"; // ✅ Extensão .js obrigatória para NodeNext

/**
 * Interface para estender a Query do Mongoose.
 * Permite que passemos o tenantId através das opções da query (ex: .find().setOptions({ tenantId })).
 */
interface MultiTenantQuery extends Query<any, any> {
  options: {
    tenantId?: mongoose.Types.ObjectId | string;
  };
}

/**
 * Plugin Multi-Tenant Profissional
 * Força o isolamento de dados em nível de infraestrutura para a AuraImobi.
 */
export const multiTenantPlugin = (schema: Schema) => {
  // 1. Injeção automática do campo tenantId no Schema
  schema.add({
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Vinculado ao admin/proprietário da imobiliária
      required: true,
      index: true, // Crucial para performance em buscas filtradas
    },
  });

  // 2. Middleware Global para Consultas (Leitura, Atualização e Deleção)
  schema.pre(/^find|count|update|delete/, function (this: MultiTenantQuery, next) {
    const tenantId = this.options.tenantId;

    // 🛡️ Segurança: Bloqueia a operação se o tenantId não for fornecido
    if (!tenantId && !this.getQuery().tenantId) {
      return next(
        new AppError("Segurança: Operação bloqueada. Tenant ID não fornecido.", 403)
      );
    }

    // Aplica o filtro 'tenantId' automaticamente em todas as buscas
    if (tenantId) {
      this.where({ tenantId });
    }

    next();
  });

  /**
   * 3. Middleware de Validação para Criação
   * Usamos 'Document' aqui para tipar o 'this', resolvendo o aviso ts(6133).
   */
  schema.pre("validate", function (this: Document & { tenantId?: any }, next) {
    // Se for um novo registro e não tiver tenantId, barramos a criação
    if (this.isNew && !this.tenantId) {
      return next(new AppError("Tenant ID é obrigatório para novos registros.", 400));
    }
    next();
  });
};