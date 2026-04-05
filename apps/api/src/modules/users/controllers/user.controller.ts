import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js"; // ✅ Alias e extensão .js
import { AppError } from "@shared/errors/AppError.js"; // ✅ Alias profissional
import User from "../modules/user.model.js"; // ✅ Ajustado para .js

/**
 * 📝 REGISTER: Cria um novo usuário vinculado ao TenantId
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, tenantId } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      tenantId,
    });

    res.status(201).json({
      status: "success",
      message: "Usuário registrado com sucesso!",
      data: { user: newUser },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new AppError("E-mail já cadastrado.", 400));
    }
    next(new AppError(error.message || "Erro ao criar usuário.", 400));
  }
};

/**
 * 🔑 LOGIN: Autentica e gera o Token JWT
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Por favor, forneça e-mail e senha.", 400));
    }

    // Buscamos o usuário incluindo explicitamente a senha para validação
    const user = await User.findOne({ email }).select("+password");

    // Validação usando o método do Model (ajustado para tipagem correta)
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("E-mail ou senha incorretos.", 401));
    }

    // Geração do Token com payload para Multi-tenancy
    const token = jwt.sign(
      { id: user._id, role: user.role, tenantId: user.tenantId },
      env.jwtSecret,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Removemos a senha da resposta por segurança
    (user as any).password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    next(new AppError("Erro ao processar login.", 500));
  }
};

/**
 * 👤 GET ME: Retorna os dados do usuário logado
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError("Não autenticado.", 401));
    }

    res.status(200).json({
      status: "success",
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};
