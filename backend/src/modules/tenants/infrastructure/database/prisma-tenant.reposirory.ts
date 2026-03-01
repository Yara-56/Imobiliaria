import { prisma } from "../../../../infrastructure/database/prisma.client.js";
import {
  ITenantRepository,
  CreateTenantData,
  PaginationQuery,
} from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";

export class PrismaTenantRepository implements ITenantRepository {
  
  /**
   * 📝 Cria um novo locatário (Renter) vinculado a um Imóvel e a um Tenant (SaaS)
   */
  async create(data: CreateTenantData): Promise<Tenant> {
    // ✅ Garantimos que o 'name' existe antes de enviar ao Prisma para evitar crash
    if (!data.name) {
      throw new Error("O nome do locatário é obrigatório para criação.");
    }

    const result = await prisma.renter.create({
      data: {
        name: data.name,
        email: data.email || null, // Se não vier, salva como null no banco
        documentUrl: data.documentUrl || null,
        propertyId: data.propertyId,
        tenantId: data.tenantId, // 🔒 Isolamento multi-tenant
      },
    });

    return result as Tenant;
  }

  /**
   * 🔍 Lista locatários de um imóvel específico com paginação
   */
  async findAll(propertyId: string, query?: PaginationQuery): Promise<Tenant[]> {
    const page = Math.max(1, query?.page ?? 1);
    const limit = Math.max(1, query?.limit ?? 10);
    const skip = (page - 1) * limit;

    const renters = await prisma.renter.findMany({
      where: { propertyId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return renters as Tenant[];
  }

  /**
   * 🆔 Busca um locatário específico garantindo que pertence ao imóvel correto
   */
  async findById(id: string, propertyId: string): Promise<Tenant | null> {
    const renter = await prisma.renter.findFirst({
      where: { 
        id, 
        propertyId // ✅ Segurança: impede que um usuário acesse dados de outro imóvel via ID
      },
    });

    return (renter as Tenant) || null;
  }

  /**
   * 🔄 Atualiza dados do locatário
   */
  async update(
    id: string,
    propertyId: string,
    data: Partial<CreateTenantData>
  ): Promise<Tenant> {
    // 1️⃣ Verificamos a existência e a posse do dado
    const existing = await this.findById(id, propertyId);

    if (!existing) {
      throw new Error("Locatário não encontrado ou você não tem permissão para editá-lo.");
    }

    // 2️⃣ Atualizamos apenas os campos permitidos
    const updated = await prisma.renter.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(), // Força a atualização do timestamp se necessário
      },
    });

    return updated as Tenant;
  }

  /**
   * 🗑️ Remove o locatário do sistema
   */
  async delete(id: string, propertyId: string): Promise<void> {
    const existing = await this.findById(id, propertyId);

    if (!existing) {
      throw new Error("Não foi possível excluir: Locatário não encontrado.");
    }

    await prisma.renter.delete({
      where: { id },
    });
  }
}