// CAMINHO COMPLETO: backend/src/modules/tenants/domain/repositories/tenant.repository.interface.ts
import { Tenant } from "../entities/tenant.entity.js";

/**
 * Tipo utilitário para criação: exige tudo da Entidade exceto IDs e datas automáticas.
 */
export type CreateTenantData = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>;

export interface ITenantRepository {
  create(data: CreateTenantData): Promise<Tenant>;
  findAll(tenantId: string): Promise<Tenant[]>;
  findById(id: string, tenantId: string): Promise<Tenant | null>;
  update(id: string, tenantId: string, data: Partial<CreateTenantData>): Promise<Tenant>;
  delete(id: string, tenantId: string): Promise<void>;
}