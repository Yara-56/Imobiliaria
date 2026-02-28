import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";
import { AppError } from "../../../shared/errors/AppError.js";

/**
 * ⚡ MODO TRIAL (ACESSO RÁPIDO)
 * Utilizado para demonstrações ou testes rápidos sem banco de dados
 */
export const enterTrial = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // IDs de exemplo (formato MongoDB ObjectId)
    const TRIAL_TENANT_ID = "65d5f1e8b3f1a2c3d4e5f6g7"; 
    
    const trialUser = {
      id: "65d5f1e8b3f1a2c3d4e5f6h8", 
      name: "Visitante Trial",
      role: "CORRETOR", // Sincronizado com seu Enum no Prisma
      tenantId: TRIAL_TENANT_ID 
    };

    // Gera o token de acesso (JWT)
    const accessToken = authService.generateAccessToken(trialUser);

    res.status(HttpStatus.OK).json({
      status: "success",
      token: accessToken,
      data: { 
        user: trialUser 
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔐 LOGIN TRADICIONAL
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError({
        message: "E-mail e senha são obrigatórios",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    // Chama o serviço que usa o Prisma para validar as credenciais
    const result = await authService.authenticateUser(email, password);

    res.status(HttpStatus.OK).json({
      status: "success",
      token: result.token,
      data: { 
        user: result.user 
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 👤 MEU PERFIL (GET ME)
 * Retorna os dados do usuário logado contidos no req.user (injetado pelo middleware)
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError({
        message: "Usuário não autenticado",
        statusCode: HttpStatus.UNAUTHORIZED
      });
    }

    res.status(HttpStatus.OK).json({ 
      status: "success", 
      data: { 
        user: req.user 
      } 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🚪 LOGOUT
 * No JWT o logout é feito limpando o token no frontend, 
 * mas aqui confirmamos a intenção.
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(HttpStatus.OK).json({ 
    status: "success", 
    message: "Sessão encerrada com sucesso" 
  });
};