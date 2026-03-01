import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;      // ID do usuário (vindo do token)
        role: string;    // admin, corretor, etc
        tenantId: string; // ID da Imobiliária (Segurança SaaS)
      };
    }
  }
}

export {};