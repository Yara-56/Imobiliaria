// src/features/tenants/mappers/tenant.mapper.ts

import type {
  CreateTenantDTO,
  Tenant,
  TenantSettings,
} from "../types/tenant.types";

const DEFAULT_SETTINGS: TenantSettings = {
  limits: {
    maxUsers: 1,
    maxProperties: 5,
  },
  features: {
    crm: false,
    automation: false,
  },
};

/** 
 * Garante que o objeto de configurações nunca seja nulo ou incompleto.
 */
export const normalizeSettings = (
  settings?: Partial<TenantSettings>
): TenantSettings => ({
  limits: {
    maxUsers: settings?.limits?.maxUsers ?? DEFAULT_SETTINGS.limits.maxUsers,
    maxProperties: settings?.limits?.maxProperties ?? DEFAULT_SETTINGS.limits.maxProperties,
  },
  features: {
    crm: settings?.features?.crm ?? DEFAULT_SETTINGS.features.crm,
    automation: settings?.features?.automation ?? DEFAULT_SETTINGS.features.automation,
  },
});

/**
 * Mapeia os dados do DTO para o formato esperado pelo BACKEND.
 * Remove espaços em branco e garante minúsculas em e-mails.
 */
export const mapTenantToApi = (data: CreateTenantDTO) => ({
  fullName: data.fullName.trim(),
  email: data.email.toLowerCase().trim(),
  phone: data.phone?.replace(/\D/g, "") ?? "", // Envia apenas números
  document: data.document.replace(/\D/g, ""), // Envia apenas números
  plan: data.plan ?? "BASIC",
  rentValue: data.rentValue ?? 0,
  billingDay: data.billingDay ?? 1,
  preferredPaymentMethod: data.preferredPaymentMethod || "PIX",
  autoUpdateContract: data.autoUpdateContract ?? false,
  settings: normalizeSettings(data.settings),
});

/**
 * Converte o retorno "sujo" da API para a interface limpa do FRONTEND.
 */
export const mapApiToTenant = (data: any): Tenant => ({
  ...data,
  // Garante que o ID da API seja mapeado corretamente para a interface
  _id: data._id || data.id, 
  settings: normalizeSettings(data.settings),
});