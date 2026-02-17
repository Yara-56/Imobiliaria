import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";

/* ======================================================
   TIPOS
====================================================== */

export type UserRole = "admin" | "corretor" | "cliente";

export interface AuthUser {
  id: string;
  role: UserRole;
  tenantId: string;
}

interface DecodedToken extends JwtPayload {
  id: string;
  role: UserRole;
  tenantId: string;
}

/* ======================================================
   PROTECT - JWT AUTH
====================================================== */

export const protect = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
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
      tenantId: decoded.tenantId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expirado.", 401));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Token inválido.", 401));
    }

    return next(
      error instanceof AppError
        ? error
        : new AppError("Não autorizado.", 401)
    );
  }
};

/* ======================================================
   AUTHORIZE - ROLE BASED ACCESS
====================================================== */

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Usuário não autenticado.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Acesso negado. Permissão insuficiente.", 403)
      );
    }

    next();
  };
