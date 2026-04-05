export type CreateTenantDTO = {
  fullName: string;
  email?: string;
  cpf?: string;
  phone?: string;
  tenantId: string;
};

export type UpdateTenantDTO = {
  fullName?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  notes?: string;
};