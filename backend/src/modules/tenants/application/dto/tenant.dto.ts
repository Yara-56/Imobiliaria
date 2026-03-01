export interface CreateTenantDTO {
  fullName: string;
  email: string;
}

export interface UpdateTenantDTO {
  fullName?: string;
  email?: string;
}