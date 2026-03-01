import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js"; // ✅ Import com .ts para NodeNext

/**
 * 🛡️ Middleware: attachTenant
 * Extrai o tenantId do usuário e o injeta diretamente no Request.
 */
export const attachTenant = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // 1. Segurança: O middleware 'protect' deve ter preenchido o req.user antes
  const userTenant = req.user?.tenantId;

  if (!userTenant) {
    return next(
      new AppError(
        "Acesso negado: Organização não identificada para este usuário.",
        403
      )
    );
  }

  // 2. Injeção: Agora o TS reconhece req.tenantId sem reclamar
  req.tenantId = userTenant;

  next();
};
