import { PaymentMethodType } from "../../payments/types/mix.payment.type.js";

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
 * 🏢 Interface Master de Inquilinos - Aura ImobiSys
 * Alinhada com o MongoDB e a Inteligência de Negócio Brasileira.
 */
export interface Tenant {
  _id: string;          
  tenantId: string;     // ID de isolamento sistêmico
  fullName: string;     
  email: string;
  phone?: string;
  document: string;     // CPF/CNPJ
  status: TenantStatus;
  plan: TenantPlan;
  
  // --- Dados Financeiros & Inteligência de Contrato ---
  rentValue?: string;   
  billingDay?: number;
  
  /** * 🧠 Método Preferencial (Contratual)
   * Define o padrão acordado na Lei do Inquilinato.
   */
  preferredPaymentMethod: PaymentMethodType; 

  /**
   * 🔄 Sincronização Automática
   * Se true, mudanças no Financeiro atualizam este contrato.
   */
  autoUpdateContract: boolean;

  settings: TenantSettings;
  createdAt: string;
  updatedAt?: string;
}

/** * 📝 DTOs para Comunicação API 
 * Otimizados para Tree Shaking no seu MacBook.
 */
export type CreateTenantDTO = Omit<Tenant, "_id" | "tenantId" | "createdAt" | "updatedAt" | "settings"> & {
  settings?: Partial<TenantSettings>;
};

export type UpdateTenantDTO = Partial<CreateTenantDTO>;