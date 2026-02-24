import { prisma } from "../../../../infrastructure/database/prisma.client.js";
import {
  ITenantRepository,
  CreateTenantData,
} from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export class PrismaTenantRepository implements ITenantRepository {
  async create(data: CreateTenantData): Promise<Tenant> {
    const result = await prisma.tenant.create({
      data: {
        name: data.name,
        email: data.email,
        documentUrl: data.documentUrl,
        propertyId: data.propertyId,
      },
    });

    return result as Tenant;
  }

  /**
   * 🔥 MÉTODO BLINDADO (ANTI-CRASH + PAGINAÇÃO)
   */
  async findAll(
    propertyId: string,
    query?: PaginationQuery
  ): Promise<Tenant[]> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const tenants = await prisma.tenant.findMany({
      where: { propertyId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return tenants as Tenant[];
  }

  async findById(id: string, propertyId: string): Promise<Tenant | null> {
    const tenant = await prisma.tenant.findFirst({
      where: { id, propertyId },
    });

    return tenant as Tenant | null;
  }

  /**
   * 🔐 UPDATE SEGURO (multi-tenant safe)
   */
  async update(
    id: string,
    propertyId: string,
    data: Partial<CreateTenantData>
  ): Promise<Tenant> {
    const existing = await prisma.tenant.findFirst({
      where: { id, propertyId },
    });

    if (!existing) {
      throw new Error("Tenant não encontrado para esta propriedade");
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data,
    });

    return updated as Tenant;
  }

  /**
   * 🔐 DELETE SEGURO (multi-tenant safe)
   */
  async delete(id: string, propertyId: string): Promise<void> {
    const existing = await prisma.tenant.findFirst({
      where: { id, propertyId },
    });

    if (!existing) {
      throw new Error("Tenant não encontrado para esta propriedade");
    }

    await prisma.tenant.delete({
      where: { id },
    });
  }
}