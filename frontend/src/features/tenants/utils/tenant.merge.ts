import type { Tenant, UpdateTenantDTO } from "../types/tenant.types";

export const mergeTenant = (
  tenant: Tenant,
  data: UpdateTenantDTO
): Tenant => {
  return {
    ...tenant,
    ...data,

    settings: data.settings
      ? {
          ...tenant.settings,
          ...data.settings,
          limits: {
            ...tenant.settings.limits,
            ...data.settings.limits,
          },
          features: {
            ...tenant.settings.features,
            ...data.settings.features,
          },
        }
      : tenant.settings,
  };
};