import { ITenantRepository, CreateTenantData } from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";
import { PrismaTenantRepository } from "../../infrastructure/database/prisma-tenant.reposirory.js";

export class TenantService {
  constructor(
    private readonly repo: ITenantRepository = new PrismaTenantRepository()
  ) {}

  async create(data: CreateTenantData): Promise<Tenant> {
    return this.repo.create(data);
  }

  async findAll(tenantId: string): Promise<Tenant[]> {
    return this.repo.findAll(tenantId);
  }

  async findById(id: string, tenantId: string): Promise<Tenant | null> {
    return this.repo.findById(id, tenantId);
  }

  async update(id: string, tenantId: string, data: Partial<CreateTenantData>): Promise<Tenant> {
    return this.repo.update(id, tenantId, data);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repo.delete(id, tenantId);
  }
}