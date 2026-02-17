import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

/**
 * Middleware para restringir acesso baseado em cargos (Roles).
 * @param roles Lista de cargos permitidos (ex: 'admin', 'corretor', 'financeiro')
 * * Este middleware assume que o middleware de 'protect' (autenticação)
 * já foi executado e anexou o usuário ao 'req.user'.
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Verifica se o usuário foi autenticado previamente
    if (!req.user) {
      return next(new AppError("Usuário não identificado. Autenticação necessária.", 401));
    }

    // 2. Verifica se o cargo do usuário está na lista de permissões
    // Ex: Se a rota exige ['admin'] e o usuário é 'corretor', o acesso é negado.
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Acesso negado. Seu cargo (${req.user.role}) não tem permissão para realizar esta ação.`, 
          403
        )
      );
    }

    // 3. Usuário autorizado, segue para o Controller
    next();
  };
};