import { Tenant } from "../entities/tenant.entity.js";

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ITenantRepository {
  create(tenant: Tenant): Promise<Tenant>;

  findAll(tenantId: string, query?: PaginationQuery): Promise<Tenant[]>;

  findById(id: string, tenantId: string): Promise<Tenant | null>;

  findByEmail(email: string, tenantId: string): Promise<Tenant | null>;

  findByCPF(cpf: string, tenantId: string): Promise<Tenant | null>;

  update(tenant: Tenant): Promise<Tenant>;

  delete(id: string, tenantId: string): Promise<void>;

  count(tenantId: string): Promise<number>;
}