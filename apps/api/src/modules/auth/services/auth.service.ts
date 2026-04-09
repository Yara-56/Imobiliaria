import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { prisma } from "@config/database.config.js";
import { env } from "@config/env.js";

import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";

/* ==========================================================
   TYPES (ZERO ANY)
========================================================== */

type JwtPayload = {
  sub: string;
  role: string;
  tenantId: string;
};

type AuthUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
};

type AuthResponse = {
  token: string;
  user: AuthUserResponse;
};

/* ==========================================================
   TOKEN GENERATION
========================================================== */

export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, options);
};

/* ==========================================================
   PASSWORD VALIDATION
========================================================== */

const validatePassword = async (plain: string, hash: string): Promise<void> => {
  const isValid = await bcrypt.compare(plain, hash);

  if (!isValid) {
    throw new AppError({
      message: "Credenciais inválidas",
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
};

/* ==========================================================
   AUTO-CREATE USER IF TENANT EXISTS
   - Email do Zoho OU email real da imobiliária
   - Cria automaticamente o primeiro ADMIN da empresa
========================================================== */

const autoCreateUserIfTenantExists = async (
  email: string,
  password: string
): Promise<AuthUserResponse> => {
  // Buscar tenant pelo e-mail (email é @unique no Prisma)
  const tenant = await prisma.tenant.findUnique({
    where: { email },
  });

  if (!tenant) {
    throw new AppError({
      message: "Tenant não encontrado. Cadastre a empresa primeiro.",
      statusCode: HttpStatus.NOT_FOUND,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name: `${tenant.name} (Admin)`, // <--- CORRETO (seu schema não tem fullName)
      email,
      password: hashedPassword,
      role: "ADMIN",
      tenantId: tenant.id,
      isActive: true,
    },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    tenantId: newUser.tenantId,
  };
};

/* ==========================================================
   AUTHENTICATE USER (LOGIN PRINCIPAL)
========================================================== */

export const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const normalizedEmail = email.trim().toLowerCase();

  // Buscar usuário no banco
  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Usuário não existe → tentar criar automaticamente
  if (!user) {
    const created = await autoCreateUserIfTenantExists(normalizedEmail, password);

    const token = generateAccessToken({
      sub: created.id,
      role: created.role,
      tenantId: created.tenantId,
    });

    return { token, user: created };
  }

  // Verificar se usuário está ativo
  if (!user.isActive) {
    throw new AppError({
      message: "Conta desativada",
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  // Validar senha
  await validatePassword(password, user.password);

  const authUser: AuthUserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  };

  const token = generateAccessToken({
    sub: user.id,
    role: user.role,
    tenantId: user.tenantId,
  });

  return { token, user: authUser };
};

/* ==========================================================
   MANUAL REGISTER (opcional, usado por Admin global)
========================================================== */

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  tenantId: string;
}): Promise<{ id: string; email: string }> => {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (userExists) {
    throw new AppError({
      message: "Usuário já existe",
      statusCode: HttpStatus.CONFLICT,
    });
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      isActive: true,
    },
  });

  return {
    id: user.id,
    email: user.email,
  };
};