/**
 * ======================================================
 * 🏢 IMOBISYS — TENANT DOMAIN TYPES (Frontend)
 * ======================================================
 */

import type { PaymentMethodType } from "../../payments/types/mix.payment.type";

export type { PaymentMethodType };

export type TenantPlan = "BASIC" | "PRO" | "ENTERPRISE";

export type TenantStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

/**
 * Tipos de documento
 */
export enum DocumentType {
  RG = "RG",
  CPF = "CPF",
  CNH = "CNH",
  CONTRATO = "CONTRATO",
  COMPROVANTE_RESIDENCIA = "COMPROVANTE_RESIDENCIA",
  COMPROVANTE_RENDA = "COMPROVANTE_RENDA",
  OUTROS = "OUTROS",
}

/**
 * Documento anexado
 */
export interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
  tenantId: string;
}

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
  profilePhotoUrl?: string;
  documents?: Document[];
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
  
  // 📎 Arquivos (preparado para o futuro)
  profilePhoto?: File;
  documents?: File[];
}

/**
 * Payload de atualização
 */
export interface UpdateTenantDTO {
  fullName?: string;
  email?: string;
  document?: string;
  phone?: string;
  plan?: TenantPlan;
  rentValue?: number;
  billingDay?: number;
  preferredPaymentMethod?: PaymentMethodType;
  autoUpdateContract?: boolean;
  settings?: Partial<TenantSettings>;
  status?: TenantStatus;
  
  // 📎 Arquivos (preparado para o futuro)
  profilePhoto?: File;
  documents?: File[];
}

/**
 * Resposta única de tenant
 */
export interface TenantResponse {
  data: Tenant;
}

/**
 * Resposta de lista de tenants
 */
export interface TenantListResponse {
  data: Tenant[];
  total?: number;
}

/**
 * DTO para upload de documento individual
 */
export interface UploadDocumentDTO {
  tenantId: string;
  type: DocumentType;
  file: File;
}