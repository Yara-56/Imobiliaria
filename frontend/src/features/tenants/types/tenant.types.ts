/**
 * ======================================================
 * 🏢 IMOBISYS — TENANT DOMAIN TYPES
 * ------------------------------------------------------
 * Modelos, DTOs e contratos de API para Tenant
 * Arquitetura preparada para SaaS multi-tenant escalável
 * ======================================================
 */

import { PaymentMethodType } from "../../payments/types/mix.payment.type.js";



/**
 * ======================================================
 * 📊 Tenant Status
 * ------------------------------------------------------
 * Controla acesso e comportamento da conta
 * ======================================================
 */
export enum TenantStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  INACTIVE = "INACTIVE"
}



/**
 * ======================================================
 * 🏷️ Tenant Plan
 * ------------------------------------------------------
 * Plano contratado dentro do SaaS
 * ======================================================
 */
export enum TenantPlan {
  BASIC = "BASIC",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE"
}



/**
 * ======================================================
 * ⚙️ Tenant Feature Flags
 * ------------------------------------------------------
 * Ativa ou desativa módulos do sistema
 * ======================================================
 */
export interface TenantFeatures {
  crm: boolean
  automation: boolean
  financial: boolean
  reports: boolean
}



/**
 * ======================================================
 * ⚙️ Tenant Limits
 * ------------------------------------------------------
 * Limites de uso por plano
 * ======================================================
 */
export interface TenantLimits {
  maxUsers: number
  maxProperties: number
  maxContracts: number
}



/**
 * ======================================================
 * ⚙️ Tenant Settings
 * ------------------------------------------------------
 * Configurações específicas do tenant
 * ======================================================
 */
export interface TenantSettings {
  limits: TenantLimits
  features: TenantFeatures
}



/**
 * ======================================================
 * 🏢 Tenant Domain Model
 * ------------------------------------------------------
 * Representa uma organização dentro do SaaS
 * e define o isolamento multi-tenant
 * ======================================================
 */
export interface Tenant {

  /** MongoDB ObjectId */
  _id: string

  /**
   * ID interno usado para isolamento
   * ex: tenant_8fj23kd
   */
  tenantId: string

  /**
   * Nome completo do locatário
   */
  fullName: string

  /**
   * Email principal
   */
  email: string

  /**
   * Telefone de contato
   */
  phone?: string

  /**
   * Documento brasileiro
   * CPF ou CNPJ
   */
  document: string



  /**
   * ======================================================
   * 📊 STATUS
   * ======================================================
   */

  status: TenantStatus
  plan: TenantPlan



  /**
   * ======================================================
   * 💰 FINANCEIRO
   * ======================================================
   */

  /** Valor do aluguel */
  rentValue?: number

  /** Dia da cobrança */
  billingDay?: number

  /** Método de pagamento preferido */
  preferredPaymentMethod: PaymentMethodType

  /** Atualização automática de contrato */
  autoUpdateContract: boolean



  /**
   * ======================================================
   * ⚙️ CONFIGURAÇÕES
   * ======================================================
   */

  settings: TenantSettings



  /**
   * ======================================================
   * 📅 AUDITORIA
   * ======================================================
   */

  createdAt: string
  updatedAt?: string
}



/**
 * ======================================================
 * 📝 DTO — Create Tenant
 * ======================================================
 */
export interface CreateTenantDTO {

  fullName: string

  email: string

  document: string

  phone?: string

  plan?: TenantPlan

  rentValue?: number

  billingDay?: number

  preferredPaymentMethod: PaymentMethodType

  autoUpdateContract?: boolean

  settings?: Partial<TenantSettings>
}



/**
 * ======================================================
 * 📝 DTO — Update Tenant
 * ======================================================
 */
export type UpdateTenantDTO =
  Partial<CreateTenantDTO>



/**
 * ======================================================
 * 📦 API RESPONSE
 * ======================================================
 */
export interface TenantResponse {
  data: Tenant
}



/**
 * ======================================================
 * 📦 API LIST RESPONSE
 * ======================================================
 */
export interface TenantListResponse {
  data: Tenant[]
  total: number
}