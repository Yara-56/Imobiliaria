import { type Request, type Response, type NextFunction } from "express";
import * as authService from "../services/auth.service.js"; // ✅ Extensão corrigida
import { AppError } from "@shared/errors/AppError.js"; // ✅ Alias e extensão .js

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.registerUser(req.body);
    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/v1/auth/refresh",
    });

    res.status(201).json({ status: "success", token: accessToken, data: { user } });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser({ email, password });
    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/v1/auth/refresh",
    });

    res.status(200).json({ status: "success", token: accessToken, data: { user } });
  } catch (error: any) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new AppError("Sessão expirada.", 401);

    const user = await authService.validateRefreshToken(refreshToken);
    const newAccessToken = authService.generateAccessToken(user);

    res.status(200).json({ status: "success", token: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Não autenticado", 401);
    res.status(200).json({ status: "success", data: { user: req.user } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
  res.status(204).json({ status: "success" });
};