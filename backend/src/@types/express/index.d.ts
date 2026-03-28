// src/@types/express/index.d.ts

import { Renter, Document, Receipt } from "@prisma/client";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      tenantId: string;
      role: "admin" | "corretor" | "gerente" | "user";

      // CAMPOS OPCIONAIS → eliminam qualquer conflito com o Express
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
      user: UserPayload;

      renter?: Renter;
      document?: Document;
      receipt?: Receipt;
    }
  }
}

export {};