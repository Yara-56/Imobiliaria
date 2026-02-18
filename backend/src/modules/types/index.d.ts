import { AuthUser } from "../modules/auth/auth.types.ts";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthUser;
      tenantId?: string;
    }
  }
}

export {};