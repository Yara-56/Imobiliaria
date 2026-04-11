import type { Request, Response, NextFunction } from "express";
import * as authService from "@modules/auth/services/auth.service.js";
import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";

export { login, getMe, logout } from "@modules/auth/controllers/auth.controller.js";

/**
 * Registro manual (admin / onboarding) — delega ao serviço de auth com Prisma.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, tenantId } = req.body;

    if (!name || !email || !password || !tenantId) {
      return next(
        new AppError({
          message: "name, email, password e tenantId são obrigatórios.",
          statusCode: HttpStatus.BAD_REQUEST,
        })
      );
    }

    await authService.registerUser({
      name,
      email,
      password,
      role: role ?? "USER",
      tenantId,
    });

    res.status(HttpStatus.CREATED).json({
      status: "success",
      message: "Usuário registrado com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};
