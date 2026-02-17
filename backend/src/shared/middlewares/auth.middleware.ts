import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.ts";
import { AppError } from "../errors/AppError.ts";

export type UserRole = "admin" | "corretor" | "cliente";

export interface AuthUser {
  id: string;
  role: UserRole;
  tenantId: string;
}

interface DecodedToken extends jwt.JwtPayload {
  id: string;
  role: UserRole;
  tenantId: string;
}

/**
 * 🛡️ PROTECT: Valida o JWT e injeta o contexto do usuário
 */
export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Extração do Token (Header ou Cookie)
    let token = req.headers.authorization?.startsWith("Bearer") 
      ? req.headers.authorization.split(" ")[1] 
      : req.cookies?.token;

    if (!token) {
      return next(new AppError("Acesso negado. Por favor, faça login.", 401));
    }

    // 2. Verificação do JWT
    const decoded = jwt.verify(token, env.jwtSecret) as DecodedToken;

    // 3. Injeção do Contexto (Multi-tenant ready)
    req.user = { 
      id: decoded.id, 
      role: decoded.role, 
      tenantId: decoded.tenantId 
    };
    req.tenantId = decoded.tenantId; 

    next();
  } catch (error) {
    next(new AppError("Sessão inválida ou expirada. Faça login novamente.", 401));
  }
};

/**
 * 👮 AUTHORIZE: Controle de acesso baseado em cargos
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Você não tem permissão para realizar esta ação.", 403));
    }
    next();
  };
};