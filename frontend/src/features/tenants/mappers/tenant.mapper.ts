import { CreateTenantDTO } from "../types/tenant.enums";

export const mapTenantToApi = (data: CreateTenantDTO) => {
  return {
    name: data.fullName,
    email: data.email,
    phone: data.phone,
    document: data.document,
    plan: data.plan,
    rentValue: data.rentValue,
    billingDay: data.billingDay,
    preferredPaymentMethod: data.preferredPaymentMethod,
    autoUpdateContract: data.autoUpdateContract,
    settings: data.settings,
  };
};