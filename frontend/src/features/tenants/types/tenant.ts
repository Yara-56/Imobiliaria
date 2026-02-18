export type TenantPlan = "BASIC" | "PRO" | "ENTERPRISE";
export type TenantStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface TenantSettings {
  maxUsers: number;
  maxProperties: number;
  features: {
    crm: boolean;
    automation: boolean;
  };
}

/**
 * 🏢 Interface Master de Inquilinos
 * Alinhada com os campos do seu TenantForm e o Schema do MongoDB.
 */
export interface Tenant {
  _id: string;          
  tenantId: string;     // ID de isolamento sistêmico
  fullName: string;     // ✅ Alinhado com o Input name="fullName"
  email: string;
  phone?: string;
  document: string;     // ✅ CPF/CNPJ (Alinhado com o formulário)
  status: TenantStatus;
  plan: TenantPlan;
  
  // Dados Financeiros (Vindos do seu formulário)
  rentValue?: string;   
  billingDay?: number;
  paymentMethod?: "pix" | "boleto" | "cartao";
  
  settings: TenantSettings;
  createdAt: string;
  updatedAt?: string;
}

/** * 📝 DTOs para Comunicação API 
 * No NodeNext, use export type para garantir que o compilador do seu MacBook 
 * otimize a árvore de dependências (Tree Shaking).
 */
export type CreateTenantDTO = Omit<Tenant, "_id" | "tenantId" | "createdAt" | "updatedAt" | "settings"> & {
  settings?: Partial<TenantSettings>; // Torna opcional na criação
};

export type UpdateTenantDTO = Partial<CreateTenantDTO>;