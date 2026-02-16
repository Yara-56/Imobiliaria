import mongoose from "mongoose";
import { AppError } from "../errors/AppError.js";

/**
 * Plugin Multi-Tenant Profissional
 * Força o isolamento de dados em nível de infraestrutura (Mongoose).
 */
export const multiTenantPlugin = (schema) => {
  // 1. Injeção automática do campo tenantId
  schema.add({
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
  });

  // 2. Middleware Global de Filtro
  schema.pre(/^find|count|update|delete/, function (next) {
    const tenantId = this.options.tenantId;

    // Se a query não tem tenantId e não foi passado nas options, bloqueamos por segurança
    if (!tenantId && !this.getQuery().tenantId) {
      return next(
        new AppError("Segurança: Operação bloqueada. Tenant ID não fornecido.", 403)
      );
    }

    // Aplica o filtro automaticamente se ele veio nas options
    if (tenantId) {
      this.where({ tenantId });
    }

    next();
  });

  // 3. Middleware para salvar (Criação)
  schema.pre("validate", function (next) {
    if (this.isNew && !this.tenantId) {
      return next(new AppError("Tenant ID é obrigatório para novos registros.", 400));
    }
    next();
  });
};