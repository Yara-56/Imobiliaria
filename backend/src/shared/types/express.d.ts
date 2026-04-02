import { Request } from "express";

export interface AuthUser {
  id: string;
  tenantId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}