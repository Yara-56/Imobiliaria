import jwt from "jsonwebtoken";
import User, { UserDocument } from "../users/user.model";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";

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

export const generateAccessToken = (
  user: UserDocument
): string => {
  const payload: AccessTokenPayload = {
    id: user._id.toString(),
    role: user.role,
    tenantId: user.tenantId,
  };

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (
  user: UserDocument
): string => {
  const payload: RefreshTokenPayload = {
    id: user._id.toString(),
  };

  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn:
      env.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"],
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
   🔑 LOGIN
====================================================== */

export const loginUser = async ({
  email,
  password,
}: LoginInput): Promise<UserDocument> => {
  if (!email || !password) {
    throw new AppError("E-mail e senha são obrigatórios", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }

  if (user.status !== "ativo") {
    throw new AppError("Usuário inativo ou bloqueado", 403);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }

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

    if (!user || user.status !== "ativo") {
      throw new AppError("Sessão inválida", 401);
    }

    return user;
  } catch {
    throw new AppError("Sessão expirada ou inválida", 401);
  }
};
