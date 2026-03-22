// src/@types/express.d.ts

import { Renter, Document, Receipt } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;           // ID do usuário (vindo do token JWT)
        email: string;        // Email do usuário
        role: "admin" | "corretor" | "gerente" | "user"; // Papel do usuário
        tenantId: string;     // ID da Imobiliária (Segurança SaaS)
      };
      tenant?: Renter;        // Inquilino validado
      document?: Document;    // Documento validado
      receipt?: Receipt;      // Recibo validado
    }
  }
}

export {};