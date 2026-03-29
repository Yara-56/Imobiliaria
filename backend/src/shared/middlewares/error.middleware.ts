import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../http/http-status";
import { BaseResponse } from "../http/base-response";
import { logger } from "../utils/logger";
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/error-codes";
import { tenantContext } from "../tentant/tenant.context";

/**
 * 🚨 Middleware Global de Erros (Production Ready)
 */
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  /**
   * 🧠 CONTEXTO (multi-tenant + rastreabilidade)
   */
  let requestId: string | undefined;
  let companyId: string | undefined;

  try {
    requestId = tenantContext.getRequestId();
    companyId = tenantContext.getCompanyId();
  } catch {
    requestId = req.requestId;
  }

  /**
   * 🔍 ERRO OPERACIONAL (AppError)
   */
  if (err instanceof AppError) {
    logger.warn({
      message: err.message,
      errorCode: err.errorCode,
      details: err.details,
      requestId,
      companyId,
      path: req.originalUrl,
      method: req.method,
    });

    return res.status(err.statusCode).json(
      BaseResponse.error(
        err.message,
        {
          code: err.errorCode,
          details: err.details ?? null,
        },
        {
          requestId,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        }
      )
    );
  }

  /**
   * 💥 ERRO DESCONHECIDO (BUG)
   */
  const unknownError =
    err instanceof Error ? err : new Error(String(err));

  logger.error({
    message: unknownError.message,
    stack: unknownError.stack,
    requestId,
    companyId,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
    BaseResponse.error(
      "Erro interno do servidor",
      {
        code: ErrorCodes.INTERNAL_ERROR,
        details: null,
      },
      {
        requestId,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      }
    )
  );
};