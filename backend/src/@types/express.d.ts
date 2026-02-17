import { AuthUser } from "../shared/middlewares/auth.middleware.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      tenantId?: string;
    }
  }
}