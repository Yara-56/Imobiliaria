// CAMINHO: backend/src/shared/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";

/* ======================================================
   TIPOS - Sincronizados com o seu express.d.ts
====================================================== */
export type UserRole = "admin" | "corretor" | "cliente";

interface TokenPayload {
  id: string;
  role: UserRole;
  tenantId: string;
}

/* ======================================================
   🛡️ PROTECT - VALIDAÇÃO DE JWT
====================================================== */
export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError({
        message: "Acesso negado. Por favor, faça login.",
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    // ✅ Sincronizado com o seu global types (_id)
    req.user = {
      _id: decoded.id,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    next();
  } catch (error) {
    next(new AppError({
      message: "Token inválido ou expirado.",
      statusCode: HttpStatus.UNAUTHORIZED,
    }));
  }
};

/* ======================================================
   🔐 AUTHORIZE - CONTROLE DE ACESSO (RBAC)
   ✅ Resolvendo o erro ts(2305): Exportação explícita
====================================================== */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // 🛡️ Segurança: Verifica se o 'protect' já injetou o usuário
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      return next(new AppError({
        message: "Você não tem permissão para realizar esta ação.",
        statusCode: HttpStatus.FORBIDDEN,
      }));
    }
    next();
  };
};