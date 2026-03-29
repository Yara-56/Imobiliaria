import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/error-codes";

/**
 * 🛡️ Middleware: attachTenant
 */
export const attachTenant = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const userTenant = req.user?.tenantId;

  if (!userTenant) {
    return next(
      new AppError({
        message: "Acesso negado: Organização não identificada para este usuário.",
        statusCode: 403,
        errorCode: ErrorCodes.UNAUTHORIZED,
      })
    );
  }

  req.tenantId = userTenant;

  return next();
};