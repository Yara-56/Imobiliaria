import jwt from "jsonwebtoken";
import User, { UserDocument } from "../../users/models/user.model.js";
import { env } from "../../../config/env.js";
import { AppError } from "../../../shared/errors/AppError.js";

/* ======================================================
   TYPES
====================================================== */

interface AccessTokenPayload {
  id: string;
  role: string;
  tenantId: string;
}

interface RefreshTokenPayload {
  id: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  tenantId: string;
  role?: "admin" | "corretor" | "cliente";
}

interface LoginInput {
  email: string;
  password: string;
}

/* ======================================================
   🔐 TOKEN GENERATION
====================================================== */

export const generateAccessToken = (user: UserDocument): string => {
  const payload: AccessTokenPayload = {
    id: user._id.toString(),
    role: user.role,
    tenantId: user.tenantId,
  };

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (user: UserDocument): string => {
  const payload: RefreshTokenPayload = {
    id: user._id.toString(),
  };

  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

/* ======================================================
   📝 REGISTER
====================================================== */

export const registerUser = async (
  userData: RegisterInput
): Promise<UserDocument> => {
  const existing = await User.findOne({ email: userData.email });

  if (existing) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  const user = await User.create(userData);
  return user;
};

/* ======================================================
   🔑 LOGIN (MODO LIBERADO - BYPASS)
====================================================== */

export const loginUser = async ({
  email,
}: LoginInput): Promise<UserDocument> => {
  // 1. Tenta achar o usuário pelo e-mail fornecido
  let user = await User.findOne({ email });

  // 2. Se não achar, pega o PRIMEIRO usuário do banco (geralmente o admin)
  if (!user) {
    user = await User.findOne();
  }

  // 3. Se o banco estiver vazio, aí não tem como fugir do erro
  if (!user) {
    throw new AppError(
      "Nenhum usuário encontrado no banco de dados. Rode o script de seed.",
      404
    );
  }

  // 🔴 BYPASS TOTAL: Ignoramos senha e status ativo.
  // Qualquer tentativa de login com qualquer senha será aceita.

  user.lastLogin = new Date();
  await user.save();

  return user;
};

/* ======================================================
   🔄 REFRESH TOKEN
====================================================== */

export const validateRefreshToken = async (
  token: string
): Promise<UserDocument> => {
  try {
    const decoded = jwt.verify(
      token,
      env.jwtRefreshSecret
    ) as RefreshTokenPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError("Sessão inválida", 401);
    }

    return user;
  } catch {
    throw new AppError("Sessão expirada ou inválida", 401);
  }
};
