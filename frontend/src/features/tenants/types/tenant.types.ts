/**
 * ======================================================
 * 🏢 IMOBISYS — TENANT DOMAIN TYPES (Frontend)
 * ======================================================
 */

import type { PaymentMethodType } from "../../payments/types/mix.payment.type";

export type { PaymentMethodType };

export type TenantPlan = "BASIC" | "PRO" | "ENTERPRISE";

export type TenantStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface TenantFeatures {
  crm: boolean;
  automation: boolean;
}

export interface TenantLimits {
  maxUsers: number;
  maxProperties: number;
}

export interface TenantSettings {
  limits: TenantLimits;
  features: TenantFeatures;
}

/**
 * Entidade retornada pela API
 */
export interface Tenant {
  _id: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone?: string;
  document: string;
  status: TenantStatus;
  plan: TenantPlan;
  rentValue?: number;
  billingDay?: number;
  preferredPaymentMethod: PaymentMethodType;
  autoUpdateContract: boolean;
  settings: TenantSettings;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Payload de criação — enviado pelo formulário
 */
export interface CreateTenantDTO {
  fullName: string;
  email: string;
  document: string;
  phone?: string;
  plan?: TenantPlan;
  rentValue?: number;
  billingDay?: number;
  preferredPaymentMethod: PaymentMethodType;
  autoUpdateContract?: boolean;
  settings?: Partial<TenantSettings>;
}

export type UpdateTenantDTO = Partial<CreateTenantDTO>;

export interface TenantResponse {
  data: Tenant;
}

export interface TenantListResponse {
  data: Tenant[];
  total?: number;
}
