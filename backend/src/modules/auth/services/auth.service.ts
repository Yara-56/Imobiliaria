import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../users/modules/user.model.js";
import { AppError } from "@shared/errors/AppError.js";

interface JwtPayload {
  id: string;
  role: "ADMIN" | "USER";
  companyId: string;
}

/* =========================
   REGISTER
========================= */

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  companyId: string;
  role?: "ADMIN" | "USER";
}) => {
  const { name, email, password, companyId, role = "USER" } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("E-mail já cadastrado", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    companyId,
    role,
  });

  return user;
};

/* =========================
   LOGIN
========================= */

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Credenciais inválidas", 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Credenciais inválidas", 401);
  }

  return user;
};

/* =========================
   TOKEN GENERATION
========================= */

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      companyId: user.companyId,
    } as JwtPayload,
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};

/* =========================
   REFRESH VALIDATION
========================= */

export const validateRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return user;
  } catch {
    throw new AppError("Refresh token inválido ou expirado", 401);
  }
};
