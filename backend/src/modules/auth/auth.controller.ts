import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import { env } from "../../config/env.js";

// Tipagem para as opções de cookie
const cookieOptions: any = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict",
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authService.loginUser(req.body);

    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    // Removemos a senha do objeto de retorno por segurança
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      })
      .status(200)
      .json({
        status: "success",
        accessToken,
        user: userResponse,
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("refreshToken", {
    ...cookieOptions,
  });

  res.status(200).json({
    status: "success",
    message: "Logout realizado com sucesso",
  });
};