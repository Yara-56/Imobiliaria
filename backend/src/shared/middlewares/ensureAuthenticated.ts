import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  tenantId: string;
  role: "admin" | "corretor" | "gerente" | "user";
  iat: number;
  exp: number;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  if (!token) {
    return res.status(401).json({ message: "Token não informado" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      tenantId: decoded.tenantId,
      role: decoded.role
    };

    // multi-tenant
    req.tenantId = decoded.tenantId;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}