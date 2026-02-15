import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";

export const loginUser = async ({ email, password }) => {
  // 1. Busca usuário e força a vinda da senha (que costuma ser select: false)
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }

  // 2. Verifica se o usuário está ativo
  if (!user.active) {
    throw new AppError("Esta conta foi desativada", 403);
  }

  return user;
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, tenantId: user.tenantId, role: user.role },
    env.jwtSecret,
    { expiresIn: "15m" } // Token curto (segurança)
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    env.jwtRefreshSecret, // Use uma secret diferente para o refresh!
    { expiresIn: "7d" } // Token longo (conveniência)
  );
};