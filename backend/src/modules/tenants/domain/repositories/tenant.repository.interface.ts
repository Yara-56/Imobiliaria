import { Tenant } from "../entities/tenant.entity.js";

/**
 * 📄 Paginação padrão SaaS
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * 📦 Create DTO
 */
export type CreateTenantData = Omit<
  Tenant,
  "id" | "createdAt" | "updatedAt"
>;

export interface ITenantRepository {
  create(data: CreateTenantData): Promise<Tenant>;

  /**
   * 🔥 PROFISSIONAL — aceita filtros
   */
  findAll(
    tenantId: string,
    query?: PaginationQuery
  ): Promise<Tenant[]>;

  findById(id: string, tenantId: string): Promise<Tenant | null>;

  update(
    id: string,
    tenantId: string,
    data: Partial<CreateTenantData>
  ): Promise<Tenant>;

  delete(id: string, tenantId: string): Promise<void>;
}