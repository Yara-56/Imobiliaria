import { PaymentMethodType } from "../../payments/types/mix.payment.type.js";

/**
 * ======================================================
 * 🏷️ Tenant Plans
 * Planos disponíveis no SaaS ImobiSys
 * ======================================================
 */
export type TenantPlan =
  | "BASIC"
  | "PRO"
  | "ENTERPRISE";

/**
 * ======================================================
 * 📊 Status do Tenant
 * Controla acesso e comportamento no sistema
 * ======================================================
 */
export type TenantStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "INACTIVE";

/**
 * ======================================================
 * ⚙️ Configurações específicas do Tenant
 * Controla limites e features disponíveis
 * ======================================================
 */
export interface TenantSettings {
  maxUsers: number;
  maxProperties: number;

  features: {
    crm: boolean;
    automation: boolean;
  };
}

/**
 * ======================================================
 * 🏢 Tenant Domain Model
 * Modelo principal de inquilino no sistema.
 *
 * Representa uma organização dentro do SaaS
 * e define o isolamento multi-tenant.
 * ======================================================
 */
export interface Tenant {
  /** MongoDB ObjectId */
  _id: string;

  /**
   * ID interno usado para isolamento multi-tenant
   * (ex: tenant_89d7123)
   */
  tenantId: string;

  /** Nome completo do locatário */
  fullName: string;

  /** Email principal */
  email: string;

  /** Telefone de contato */
  phone?: string;

  /**
   * Documento brasileiro
   * Pode ser CPF ou CNPJ
   */
  document: string;

  /** Status da conta */
  status: TenantStatus;

  /** Plano contratado */
  plan: TenantPlan;

  /**
   * ======================================================
   * 💰 Dados Financeiros
   * ======================================================
   */

  /** Valor do aluguel contratado */
  rentValue?: number;

  /** Dia de cobrança do aluguel */
  billingDay?: number;

  /**
   * Método preferencial de pagamento
   * (PIX, BOLETO, TRANSFERENCIA)
   */
  preferredPaymentMethod: PaymentMethodType;

  /**
   * Sincroniza mudanças financeiras automaticamente
   * com o contrato do locatário
   */
  autoUpdateContract: boolean;

  /**
   * Configurações específicas do tenant
   */
  settings: TenantSettings;

  /** Data de criação */
  createdAt: string;

  /** Última atualização */
  updatedAt?: string;
}

/**
 * ======================================================
 * 📝 DTO - Create Tenant
 * Usado para criação via API
 * ======================================================
 */
export interface CreateTenantDTO {
  fullName: string;
  email: string;
  phone?: string;
  document: string;

  plan?: TenantPlan;

  rentValue?: number;
  billingDay?: number;

  preferredPaymentMethod: PaymentMethodType;

  autoUpdateContract?: boolean;

  settings?: Partial<TenantSettings>;
}

/**
 * ======================================================
 * 📝 DTO - Update Tenant
 * Usado para atualização parcial
 * ======================================================
 */
export type UpdateTenantDTO =
  Partial<CreateTenantDTO>;

/**
 * ======================================================
 * 📦 API Response
 * Padrão de retorno da API
 * ======================================================
 */
export interface TenantResponse {
  data: Tenant;
}

/**
 * ======================================================
 * 📦 API List Response
 * ======================================================
 */
export interface TenantListResponse {
  data: Tenant[];
  total?: number;
}