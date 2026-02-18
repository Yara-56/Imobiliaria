import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

/* ======================================================
   TIPOS
====================================================== */
export type UserRole = "admin" | "corretor" | "cliente";

/* ======================================================
   PROTECT - VERSÃO LIBERADA (BYPASS)
====================================================== */
export const protect = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // 🔓 INJETANDO USUÁRIO FAKE PARA PULAR LOGIN
  req.user = {
    id: "65cd00000000000000000001",
    role: "admin" as UserRole,
    tenantId: "default",
  };

  // Pula todas as verificações de JWT e segue para a rota
  next();
};

/* ======================================================
   AUTHORIZE - VERSÃO LIBERADA
====================================================== */
export const authorize =
  (..._roles: UserRole[]) =>
  (_req: Request, _res: Response, next: NextFunction): void => {
    // 🔓 Permite acesso independente da role do usuário
    next();
  };
