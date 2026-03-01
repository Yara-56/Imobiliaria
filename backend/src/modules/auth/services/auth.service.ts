import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ✅ Caminhos relativos para evitar erro ts(2307)
import { prisma } from "../../../config/database.config.js"; 
import { env } from "../../../config/env.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

/* =========================
   TOKEN GENERATION
========================= */
export const generateAccessToken = (user: any): string => {
  const payload = { 
    id: user.id, 
    role: user.role, 
    tenantId: user.tenantId 
  };

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any // O Zod garante que é string, mas o JWT quer um tipo específico
  };

  // ✅ Usando 'as jwt.Secret' resolve a ambiguidade da sobrecarga
  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, options);
};

/* =========================
   AUTHENTICATE (Login)
========================= */
export const authenticateUser = async (email: string, pass: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  // No Prisma, campos booleanos são literais, verificamos se existe e está ativo
  if (!user || user.isActive === false) {
    throw new AppError({ 
      message: "Credenciais inválidas ou conta desativada", 
      statusCode: HttpStatus.UNAUTHORIZED 
    });
  }

  const isPasswordValid = await bcrypt.compare(pass, user.password);
  if (!isPasswordValid) {
    throw new AppError({ 
      message: "Credenciais inválidas", 
      statusCode: HttpStatus.UNAUTHORIZED 
    });
  }

  const token = generateAccessToken(user);

  return {
    token,
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      tenantId: user.tenantId 
    }
  };
};

/* =========================
   REGISTER
========================= */
export const registerUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  return await prisma.user.create({
    data: { 
      ...data, 
      password: hashedPassword 
    }
  });
};