import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { HttpStatus } from "@shared/errors/http-status.js";
import { AppError } from "@shared/errors/AppError.js";

/**
 * ⚡ ENTER TRIAL MODE
 * Sessão temporária sem persistência.
 * - Ideal para demonstração rápida
 * - Nenhum dado salvo em banco
 */
export const enterTrial = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const TRIAL_TENANT_ID = "65d5f1e8b3f1a2c3d4e5f6g7";

    const trialUser = {
      id: "65d5f1e8b3f1a2c3d4e5f6h8",
      name: "Visitante Trial",
      role: "CORRETOR",
      tenantId: TRIAL_TENANT_ID,
    };

    // JWT Payload padronizado
    const token = authService.generateAccessToken({
      sub: trialUser.id,
      role: trialUser.role,
      tenantId: trialUser.tenantId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        token,
        user: trialUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔐 LOGIN
 * Fluxo:
 * 1) Valida campos obrigatórios
 * 2) Delegação total ao authService.authenticateUser()
 * 3) Retorno padronizado, seguro e limpo
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validação mínima — qualquer regra avançada deve ser no service
    if (!email || !password) {
      throw new AppError({
        message: "E-mail e senha são obrigatórios",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Execução da lógica (multi-tenant, auto-create, validação)
    const result = await authService.authenticateUser(email.trim().toLowerCase(), password);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 👤 GET ME
 * Retorna o usuário autenticado baseado no JWT
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError({
        message: "Usuário não autenticado",
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🚪 LOGOUT
 * Para JWT, logout é apenas client-side.
 */
export const logout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: "Sessão encerrada com sucesso",
  });
};