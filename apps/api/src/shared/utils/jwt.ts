import jwt from "jsonwebtoken";
import { env } from "@config/env.js";

type AccessTokenPayload = {
  id: string;
  role: string;
  tenantId: string;
};

type RefreshTokenPayload = {
  id: string;
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
  // Alterado de env.jwtSecret para env.JWT_SECRET e env.jwtExpiresIn para env.JWT_EXPIRES_IN
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  // Alterado para env.JWT_REFRESH_SECRET e env.JWT_REFRESH_EXPIRES_IN
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  // Alterado para env.JWT_REFRESH_SECRET
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};