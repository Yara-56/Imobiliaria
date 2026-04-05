import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ✅ CORREÇÃO: Usando caminho relativo para matar o erro ts(2307)
// Como o middleware está em src/shared/middlewares/, subimos dois níveis para chegar em src/
import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";

export type UserRole = "admin" | "corretor" | "cliente";

/* ======================================================
   🚀 BYPASS DEV (DESLIGUE QUANDO O FRONT ESTIVER LOGANDO)
====================================================== */
const DEV_AUTH_BYPASS = true;

interface TokenPayload {
  id: string;
  role: UserRole;
  tenantId: string;
}

/* ======================================================
   🛡️ PROTECT
====================================================== */
export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    /* ===============================
       🚀 MODO DEV — SEM LOGIN
    =============================== */
    if (DEV_AUTH_BYPASS) {
      const fakeId = "65f1a2b3c4d5e6f7a8b9c0d1"; 

      req.user = {
        id: fakeId,
        role: "admin",
        tenantId: fakeId, 
      };

      return next();
    }

    /* ===============================
       🔐 MODO REAL COM JWT
    =============================== */
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

    // ✅ CORREÇÃO: 'as string' evita o erro de sobrecarga no verify
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as TokenPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    next();
  } catch (error) {
    next(
      new AppError({
        message: "Token inválido ou expirado.",
        statusCode: HttpStatus.UNAUTHORIZED,
      })
    );
  }
};

/* ======================================================
   🔐 AUTHORIZE
====================================================== */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      return next(
        new AppError({
          message: "Você não tem permissão para realizar esta ação.",
          statusCode: HttpStatus.FORBIDDEN,
        })
      );
    }

    next();
  };
};