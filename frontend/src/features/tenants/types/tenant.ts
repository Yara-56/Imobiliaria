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

export interface Tenant {
  _id: string;          // ID gerado pelo MongoDB
  tenantId: string;     // ID de negócio usado pelo seu backend para isolamento
  name: string;
  slug: string;
  email: string;
  phone?: string;       // Opcional conforme seu formulário
  cpfCnpj?: string;     // Opcional conforme seu formulário
  status: TenantStatus;
  plan: TenantPlan;
  settings: TenantSettings;
  createdAt: string;
  updatedAt?: string;
}

// DTOs (Data Transfer Objects) para conversação com a API
export type CreateTenantDTO = Omit<Tenant, "_id" | "tenantId" | "createdAt" | "updatedAt">;
export type UpdateTenantDTO = Partial<CreateTenantDTO>;