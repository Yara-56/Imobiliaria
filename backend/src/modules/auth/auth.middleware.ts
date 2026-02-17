import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { AppError } from "../../shared/errors/AppError.js";
import { env } from "../../config/env.js";

// 1. Interface para o payload do Token
interface JwtPayload {
  id: string;
  role?: string;
}

// 2. Estendendo o tipo Request do Express globalmente para este arquivo
// Isso resolve o erro de "Property 'user' does not exist on type 'Request'"
declare global {
  namespace Express {
    interface Request {
      user?: any; 
      tenantId?: string;
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Extração do token do header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Não autorizado. Faça login para acessar.", 401));
    }

    // 3. Verificação do Token usando a secret do seu arquivo de env
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    // 4. Busca o usuário removendo a senha por segurança (essencial para Cybersecurity)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("O usuário dono deste token não existe mais.", 401));
    }

    // Injeta o usuário na requisição para uso nos controllers
    req.user = user;
    
    // Facilita o acesso ao ID do dono/corretor para os filtros de segurança
    req.tenantId = user._id.toString(); 

    next();
  } catch (error) {
    return next(new AppError("Token inválido ou expirado.", 401));
  }
};

export default protect;