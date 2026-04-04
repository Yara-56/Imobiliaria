import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../http/http-status";
import { BaseResponse } from "../http/base-response";
import { logger } from "../utils/logger";
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/error-codes";
import { tenantContext } from "../tentant/tenant.context";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // 🌍 ENV
  const isProduction = process.env.NODE_ENV === "production";

  // 🧠 CONTEXTO GLOBAL (multi-tenant + tracing)
  let requestId: string | undefined;
  let companyId: string | undefined;

  try {
    requestId = tenantContext.getRequestId();
    companyId = tenantContext.getCompanyId();
  } catch {
    requestId = (req as any).requestId;
  }

  // 🔧 NORMALIZA ERRO
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

  // 📊 LOG ESTRUTURADO
  const logPayload = {
    message: error.message,
    errorCode: error.errorCode,
    statusCode: error.statusCode,
    details: error.details,
    stack: error.stack,
    cause: error.cause,
    requestId,
    companyId,
    path: req.originalUrl,
    method: req.method,
  };

  if (error.isOperational) {
    logger.warn(logPayload);
  } else {
    logger.error(logPayload);
  }

  // 📦 RESPOSTA PADRÃO
  return res.status(error.statusCode).json(
    BaseResponse.error(
      error.message,
      {
        code: error.errorCode,
        details: error.details ?? null,
      },
      {
        requestId,
        timestamp: error.timestamp,
        path: req.originalUrl,

        // 🔥 só aparece em DEV
        ...(isProduction
          ? {}
          : {
              stack: error.stack,
              cause: error.cause,
            }),
      }
    )
  );
};