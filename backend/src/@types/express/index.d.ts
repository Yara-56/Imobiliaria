import type { AuthUser } from "../../shared/middlewares/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
