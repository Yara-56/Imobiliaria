import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@infra/http/http-status.js";
import { BaseResponse } from "@infra/http/base-response.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/error-codes.js";
import { tenantContext } from "../tenant/tenant.context.js";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // 🌍 Identifica se estamos em Produção para esconder o StackTrace (Segurança SaaS)
  const isProduction = process.env.NODE_ENV === "production";

  // 🧠 CONTEXTO GLOBAL (Recupera os IDs sem quebrar a requisição)
  let requestId: string | undefined;
  let tenantId: string | undefined;

  try {
    requestId = tenantContext.getRequestId();
    tenantId = tenantContext.getTenantId(); // ✅ Ajustado para bater com o arquivo context
  } catch {
    requestId = (req as any).requestId;
  }

  // 🔧 NORMALIZAÇÃO: Transforma qualquer erro desconhecido em um AppError formatado
  const error =
    err instanceof AppError
      ? err
      : new AppError({
          message: "Erro interno do servidor",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: ErrorCodes.INTERNAL_ERROR,
          isOperational: false,
          cause: err,
        });

  // 📊 LOG ESTRUTURADO: Essencial para debug no HomeFlux
  const logPayload = {
    message: error.message,
    errorCode: error.errorCode,
    statusCode: error.statusCode,
    requestId,
    tenantId,
    path: req.originalUrl,
    method: req.method,
    // stack e cause só vão para o log de servidor, nunca para o cliente em prod
    stack: error.stack,
    cause: error.cause,
  };

  if (error.isOperational) {
    logger.warn(logPayload);
  } else {
    logger.error(logPayload);
  }

  // 📦 RESPOSTA PADRÃO SaaS
  return res.status(error.statusCode).json(
    BaseResponse.error(
      error.message,
      {
        code: error.errorCode,
        details: (error as any).details ?? null,
      },
      {
        requestId,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,

        // 🔥 Segurança: só expõe detalhes técnicos se não for produção
        ...(!isProduction && {
          stack: error.stack,
          cause: error.cause,
        }),
      }
    )
  );
};