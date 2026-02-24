import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";

/* ======================================================
   🔧 IMPORT DO SEU ROLE REAL (AJUSTE O CAMINHO SE PRECISAR)
   👉 você disse que está em modules/auth
====================================================== */
export type UserRole = "admin" | "corretor" | "cliente";

/* ======================================================
   🚀 BYPASS DEV (DESLIGUE DEPOIS)
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
      const fakeObjectId = new mongoose.Types.ObjectId().toString();

      req.user = {
        _id: fakeObjectId,
        role: "admin",
        tenantId: fakeObjectId, // ✅ agora é ObjectId válido
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

    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    req.user = {
      _id: decoded.id,
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