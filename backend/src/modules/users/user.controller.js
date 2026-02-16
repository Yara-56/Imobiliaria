import jwt from "jsonwebtoken";
import User from "./user.model.js";
import { AppError } from "../../shared/errors/AppError.js";

//
// ==========================
// GERAR TOKEN
// ==========================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

//
// ==========================
// REGISTER
// ==========================
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    const token = generateToken(user._id);

    res.status(201).json({
      status: "success",
      token,
      user
    });

  } catch (error) {
    next(error);
  }
};

//
// ==========================
// LOGIN
// ==========================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email e senha são obrigatórios", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Credenciais inválidas", 401));
    }

    if (user.status !== "ativo") {
      return next(new AppError("Usuário inativo ou bloqueado", 403));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new AppError("Credenciais inválidas", 401));
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      user
    });

  } catch (error) {
    next(error);
  }
};

//
// ==========================
// LOGOUT
// ==========================
export const logout = async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Logout realizado com sucesso"
  });
};
