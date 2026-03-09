import { Tenant } from "../entities/tenant.entity.js";

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export type CreateTenantData = {
  fullName: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  documentUrl?: string | null;
  notes?: string | null;
  propertyId?: string | null;
  tenantId: string;
  userId?: string;
};

export interface ITenantRepository {
  create(data: CreateTenantData): Promise<Tenant>;
  findAll(tenantId: string, query?: PaginationQuery): Promise<Tenant[]>;
  findById(id: string, tenantId: string): Promise<Tenant | null>;
  update(id: string, tenantId: string, data: Partial<CreateTenantData>): Promise<Tenant>;
  delete(id: string, tenantId: string): Promise<void>;
}