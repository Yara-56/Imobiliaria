import type { CreateTenantDTO } from "../types/tenant.types";

/**
 * ======================================================
 * 🔄 Tenant Mapper
 * Converte DTO do frontend → payload esperado pela API
 * ======================================================
 */
export const mapTenantToApi = (data: CreateTenantDTO) => {
  return {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    document: data.document,
    plan: data.plan,
    rentValue: data.rentValue,
    billingDay: data.billingDay,
    preferredPaymentMethod: data.preferredPaymentMethod,
    autoUpdateContract: data.autoUpdateContract ?? false,
    settings: data.settings,
  };
};
