import jwt from "jsonwebtoken";
import User from "../users/user.model.ts";
import { env } from "../../config/env.ts";
import { AppError } from "../../shared/errors/AppError.ts";

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user._id, role: user.role, tenantId: user.tenantId },
    env.jwtSecret,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: "7d" });
};

export const registerUser = async (userData: any) => {
  return await User.create(userData);
};

export const loginUser = async ({ email, password }: any) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await (user as any).comparePassword(password))) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }
  return user;
};

export const validateRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as any;
    const user = await User.findById(decoded.id);
    if (!user || user.status !== "ativo") throw new AppError("Sessão inválida", 401);
    return user;
  } catch (err) {
    throw new AppError("Sessão expirada", 401);
  }
};