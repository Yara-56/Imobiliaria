import { Tenant } from "../entities/tenant.entity.js";

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export type CreateTenantData = {
  name: string;
  email: string;
  documentUrl?: string;
  propertyId: string;
  tenantId: string;
};

export interface ITenantRepository {
  create(data: CreateTenantData): Promise<Tenant>;
  findAll(propertyId: string, query?: PaginationQuery): Promise<Tenant[]>;
  findById(id: string, propertyId: string): Promise<Tenant | null>;
  update(id: string, propertyId: string, data: Partial<CreateTenantData>): Promise<Tenant>;
  delete(id: string, propertyId: string): Promise<void>;
}