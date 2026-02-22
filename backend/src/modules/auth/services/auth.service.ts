// CAMINHO COMPLETO: backend/src/modules/auth/services/auth.service.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/** * CORREÇÃO DE RASTRO:
 * 1. O Model de User está em modules/users/models/ (e não modules/user.model.js).
 * 2. O AppError agora usa o formato de objeto para evitar erro ts(2554).
 */
import User from "../models/user.model.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

interface JwtPayload {
  id: string;
  role: "ADMIN" | "USER";
  tenantId: string; // Atualizado de companyId para tenantId para manter o padrão
}

/* =========================
   REGISTER
========================= */
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  tenantId: string;
  role?: "ADMIN" | "USER";
}) => {
  const { name, email, password, tenantId, role = "USER" } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // ✅ CORREÇÃO: Passando objeto no AppError
    throw new AppError({ 
      message: "E-mail já cadastrado", 
      statusCode: HttpStatus.BAD_REQUEST 
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    tenantId,
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

  // Cybersecurity: select('+password') garante que busquemos a senha para comparar
  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    throw new AppError({ 
      message: "Credenciais inválidas", 
      statusCode: HttpStatus.UNAUTHORIZED 
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError({ 
      message: "Credenciais inválidas", 
      statusCode: HttpStatus.UNAUTHORIZED 
    });
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
      tenantId: user.tenantId,
    } as JwtPayload,
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { id: user._id },
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
      throw new AppError({ 
        message: "Usuário não encontrado", 
        statusCode: HttpStatus.NOT_FOUND 
      });
    }

    return user;
  } catch {
    throw new AppError({ 
      message: "Refresh token inválido ou expirado", 
      statusCode: HttpStatus.UNAUTHORIZED 
    });
  }
};