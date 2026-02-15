import * as authService from "./auth.service.js";
import { env } from "../../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict",
};

export const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);

    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    user.password = undefined;

    res
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: "success",
        accessToken,
        user,
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken");

  res.status(200).json({
    status: "success",
    message: "Logout realizado com sucesso",
  });
};