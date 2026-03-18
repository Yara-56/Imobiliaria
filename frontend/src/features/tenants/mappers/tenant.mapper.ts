import type { CreateTenantDTO, TenantSettings } from "../types/tenant.types";

export const mapTenantToApi = (data: CreateTenantDTO) => {
  const defaultSettings: TenantSettings = {
    limits: {
      maxUsers: 1,
      maxProperties: 5,
    },
    features: {
      crm: false,
      automation: false,
    },
  };

  return {
    fullName: data.fullName.trim(),
    email: data.email.toLowerCase().trim(),
    phone: data.phone?.trim(),
    document: data.document.trim(),

    plan: data.plan ?? "BASIC",

    rentValue: data.rentValue ?? 0,
    billingDay: data.billingDay ?? 5,

    preferredPaymentMethod: data.preferredPaymentMethod,

    autoUpdateContract: data.autoUpdateContract ?? true,

    settings: {
      limits: {
        maxUsers:
          data.settings?.limits?.maxUsers ??
          defaultSettings.limits.maxUsers,

        maxProperties:
          data.settings?.limits?.maxProperties ??
          defaultSettings.limits.maxProperties,
      },

      features: {
        crm:
          data.settings?.features?.crm ??
          defaultSettings.features.crm,

        automation:
          data.settings?.features?.automation ??
          defaultSettings.features.automation,
      },
    },
  };
};