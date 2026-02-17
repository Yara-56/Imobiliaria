import type { AuthUser } from "../shared/middlewares/auth.middleware.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      tenantId?: string;
    }
  }
}

export {};
