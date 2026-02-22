// CAMINHO: backend/src/modules/auth/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

/**
 * ⚡ MODO TRIAL (ACESSO RÁPIDO)
 * ✅ Certifique-se de que a palavra 'export' está presente!
 */
export const enterTrial = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const TRIAL_TENANT_ID = "507f1f77bcf86cd799439011"; 
    const trialUser = {
      _id: "65d5f1e8b3f1a2c3d4e5f6g7", 
      name: "Visitante Trial",
      role: "corretor",
      tenantId: TRIAL_TENANT_ID 
    };

    const accessToken = authService.generateAccessToken(trialUser);

    res.status(HttpStatus.OK).json({
      status: "success",
      token: accessToken,
      data: { user: trialUser }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔐 LOGIN TRADICIONAL
 * ✅ Adicionado 'export' para resolver o erro ts(2339)
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sua lógica de login aqui...
    res.status(HttpStatus.OK).json({ status: "success", message: "Login realizado" });
  } catch (error) {
    next(error);
  }
};

/**
 * 👤 MEU PERFIL (GET ME)
 * ✅ Adicionado 'export' para resolver o erro ts(2339)
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(HttpStatus.OK).json({ status: "success", data: { user: req.user } });
  } catch (error) {
    next(error);
  }
};

/**
 * 🚪 LOGOUT
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(HttpStatus.OK).json({ status: "success", message: "Logout realizado" });
};