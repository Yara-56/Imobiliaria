import { ITenantRepository, CreateTenantData } from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";
import { PrismaTenantRepository } from "../../infrastructure/database/prisma-tenant.reposirory.js";

/**
 * 🚀 TenantService — Camada de aplicação (Use Cases)
 * Responsável por orquestrar regras de negócio.
 *
 * ✅ Clean Architecture
 * ✅ Dependency Inversion
 * ✅ Tipagem forte
 * ✅ Pronto para multitenancy
 * ✅ Testável
 */
export class TenantService {
  constructor(
    private readonly repo: ITenantRepository = new PrismaTenantRepository()
  ) {}

  /**
   * 📥 Criar tenant
   */
  async create(data: CreateTenantData): Promise<Tenant> {
    return this.repo.create(data);
  }

  /**
   * 📄 Listar tenants por propriedade
   */
  async findAll(propertyId: string): Promise<Tenant[]> {
    return this.repo.findAll(propertyId);
  }

  /**
   * 🔍 Buscar tenant por ID
   */
  async findById(
    id: string,
    propertyId: string
  ): Promise<Tenant | null> {
    return this.repo.findById(id, propertyId);
  }

  /**
   * ✏️ Atualizar tenant
   */
  async update(
    id: string,
    propertyId: string,
    data: Partial<CreateTenantData>
  ): Promise<Tenant> {
    return this.repo.update(id, propertyId, data);
  }

  /**
   * 🗑️ Remover tenant
   */
  async delete(id: string, propertyId: string): Promise<void> {
    await this.repo.delete(id, propertyId);
  }
}