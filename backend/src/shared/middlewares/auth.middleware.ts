import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js";

interface AuthUser {
  id: string;
  role: string;
  tenantId: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer") 
      ? req.headers.authorization.split(" ")[1] 
      : req.cookies?.token;

    if (!token) return next(new AppError("Acesso negado. Faça login.", 401));

    const decoded = jwt.verify(token, env.jwtSecret) as any;
    
    req.user = { id: decoded.id, role: decoded.role, tenantId: decoded.tenantId };
    next();
  } catch (error) {
    next(new AppError("Sessão inválida ou expirada.", 401));
  }
};