import { Renter, Document, Receipt } from "@prisma/client";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      tenantId: string;
      role: "admin" | "corretor" | "gerente" | "user";

      name?: string;
      permissions?: string[];
      sessionId?: string;
      sessionExpiresAt?: number;
      metadata?: {
        ip?: string;
        userAgent?: string;
      };
    }

    interface Request {
      user?: UserPayload;
      tenantId?: string;

      renter?: Renter;
      document?: Document;
      receipt?: Receipt;
    }
  }
}

export {};