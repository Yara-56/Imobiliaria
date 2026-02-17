import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extração prioritária (Header > Cookie)
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError("Acesso negado. Token não fornecido.", 401));
    }

    // 2. Verificação do JWT
    // O seu JWT no login DEVE incluir { id, tenantId, role }
    const decoded = jwt.verify(token, env.jwtSecret);

    // 3. Injeção Direta (Stateless Approach)
    // Evitamos o User.findById aqui para poupar o banco. 
    // Se o usuário foi deletado, o token expirará ou você lida em rotas sensíveis.
    req.user = {
      id: decoded.id,
      role: decoded.role,
      tenantId: decoded.tenantId
    };

    // 4. Garantia Multi-tenant
    if (!decoded.tenantId) {
      return next(new AppError("Token inválido: Tenant ID ausente.", 403));
    }
    
    req.tenantId = decoded.tenantId;

    next();
  } catch (error) {
    // Diferencia erro de expiração de erro de assinatura (segurança)
    const message = error.name === "TokenExpiredError" 
      ? "Sessão expirada. Faça login novamente." 
      : "Token inválido.";
    return next(new AppError(message, 401));
  }
};