// CAMINHO COMPLETO: backend/src/shared/plugins/multi-tenant.plugin.ts
import mongoose, { Schema, Query, CallbackError } from "mongoose";

// CORREÇÃO DE CAMINHOS: Baseado no seu print, os arquivos estão em shared/errors/
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";
import { ErrorCodes } from "../errors/error-codes.js";

/**
 * Interface para estender a Query do Mongoose com opções de multi-tenancy.
 */
interface MultiTenantQuery extends Query<any, any> {
  options: mongoose.QueryOptions & {
    tenantId?: mongoose.Types.ObjectId | string;
    bypassTenant?: boolean;
  };
}

export const multiTenantPlugin = (schema: Schema) => {
  // Injeção automática do campo tenantId em todos os schemas
  schema.add({
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  });

  // Operações que serão interceptadas para garantir o isolamento de dados
  const operations = [
    "find",
    "findOne",
    "updateOne",
    "updateMany",
    "deleteOne",
    "deleteMany",
    "countDocuments",
  ] as const;

  const s = schema as Schema & { pre: (...args: unknown[]) => void };

  operations.forEach((operation) => {
    s.pre(operation, function (this: MultiTenantQuery, next: (err?: CallbackError) => void) {
      if (this.options.bypassTenant) return next();

      const tenantId = this.options.tenantId;

      if (!tenantId) {
        return next(
          new AppError({
            message: "Tenant ID não fornecido para a operação.",
            statusCode: HttpStatus.FORBIDDEN,
            errorCode: ErrorCodes.FORBIDDEN,
          })
        );
      }

      this.where({ tenantId });
      next();
    });
  });

  s.pre("validate", function (this: mongoose.Document & { tenantId?: unknown }, next: (err?: CallbackError) => void) {
    if (this.isNew && !this.tenantId) {
      return next(
        new AppError({
          message: "Tenant ID é obrigatório para novos registros.",
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: ErrorCodes.VALIDATION_ERROR
        })
      );
    }
    next();
  });
};