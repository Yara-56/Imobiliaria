import { 
  Renter, 
  Document, 
  Property, 
  User,
  Contract,
  Payment
} from "@prisma/client.js";

declare global {
  namespace Express {
    /**
     * Objeto de usuário extraído do Token JWT
     */
    interface UserPayload {
      id: string;
      email: string;
      tenantId: string; // ID da Imobiliária (Multi-tenancy)
      role: string;
      name?: string;
    }

    interface Request {
      /**
       * Usuário autenticado na requisição
       */
      user: UserPayload; 

      /**
       * ID da Imobiliária isolado para facilitar filtros
       */
      tenantId: string;   
      
      /**
       * Entidades carregadas por Middlewares de validação (Pre-fetch)
       * Isso evita que você tenha que buscar o mesmo objeto várias vezes.
       */
      renter?: Renter;     // Inquilino atual da rota
      property?: Property; // Imóvel atual da rota
      contract?: Contract; // Contrato atual da rota
      payment?: Payment;   // Pagamento/Fatura atual da rota
      document?: Document; // Documento/Arquivo atual da rota

      /**
       * Identificador único da requisição (Útil para Logs/Sentry)
       */
      requestId: string;
      
      /**
       * Informações de rastreio
       */
      clientIp?: string;
    }
  }
}

// Necessário para o TypeScript tratar este arquivo como um módulo
export {};