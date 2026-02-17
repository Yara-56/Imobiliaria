import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../users/user.model"; // Removido .js para uso com tsx
import { AppError } from "../../shared/errors/AppError";
import { env } from "../../config/env";

interface JwtPayload {
  id: string;
  role?: string;
}

// Estendendo o tipo Request globalmente para evitar erros de tipagem
declare global {
  namespace Express {
    interface Request {
      user?: any; 
      tenantId?: string;
    }
  }
}

/**
 * ✅ Alterado para Named Export (export const) para resolver o erro ts(2614)
 * Nome alterado para 'verifyToken' para bater com suas rotas
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Não autorizado. Faça login para acessar.", 401));
    }

    // Verificação usando a secret do seu arquivo env
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    // Prática de Cybersecurity: Busca o usuário ocultando a senha
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("O usuário dono deste token não existe mais.", 401));
    }

    // Injeta os dados na requisição para uso nos controllers (ex: listPayments)
    req.user = user;
    req.tenantId = user._id.toString(); 

    next();
  } catch (error) {
    return next(new AppError("Token inválido ou expirado.", 401));
  }
};