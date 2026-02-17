import { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";

/* ======================================================
   TIPAGEM DO USUÁRIO AUTENTICADO
====================================================== */

// ✅ ADICIONADO: Exportando o tipo exato que o Model está tentando importar
export type UserRole = "admin" | "corretor" | "cliente";

export interface AuthUser {
  id: string;
  role: UserRole; // Alterado de string para UserRole
  tenantId: string;
}

interface DecodedToken extends JwtPayload {
  id: string;
  role: UserRole; // Alterado de string para UserRole
  tenantId: string;
}

/* ======================================================
   MIDDLEWARE: PROTECT (JWT)
====================================================== */

export const protect = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token não fornecido.", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtSecret) as DecodedToken;

    if (!decoded.id || !decoded.role || !decoded.tenantId) {
      throw new AppError("Token inválido.", 401);
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      tenantId: decoded.tenantId
    };

    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError("Não autorizado.", 401)
    );
  }
};

/* ======================================================
   MIDDLEWARE: AUTHORIZE (ROLE-BASED)
====================================================== */

export const authorize =
  (...roles: UserRole[]) => // Alterado para aceitar apenas os tipos definidos
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Usuário não autenticado.", 401));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(
        new AppError("Acesso negado. Permissão insuficiente.", 403)
      );
    }

    next();
  };