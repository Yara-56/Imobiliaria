import { Tenant } from '../entities/tenant.entity.js';

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

export type UpdateTenantData = Partial<Omit<CreateTenantData, 'tenantId'>>;

export interface ITenantRepository {
  create(data: CreateTenantData): Promise<Tenant>;
  findAll(tenantId: string, query?: PaginationQuery): Promise<Tenant[]>;
  findById(id: string, tenantId: string): Promise<Tenant | null>;
  findByEmail(email: string, tenantId: string): Promise<Tenant | null>;
  findByCPF(cpf: string, tenantId: string): Promise<Tenant | null>;
  update(id: string, tenantId: string, data: UpdateTenantData): Promise<Tenant>;
  delete(id: string, tenantId: string): Promise<void>;
  count(tenantId: string): Promise<number>;
}

export const TENANT_REPOSITORY_TOKEN = Symbol('ITenantRepository');