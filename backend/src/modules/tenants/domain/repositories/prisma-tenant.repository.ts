import { prisma } from "../../../../infrastructure/database/prisma.client.js";
import {
  ITenantRepository,
  CreateTenantData,
  PaginationQuery,
} from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";

export class PrismaTenantRepository implements ITenantRepository {
  async create(data: CreateTenantData): Promise<Tenant> {
    const result = await prisma.renter.create({
      data: {
        name: data.name,
        email: data.email,
        documentUrl: data.documentUrl,
        propertyId: data.propertyId,
        tenantId: data.tenantId,
      },
    });

    return result as unknown as Tenant;
  }

  async findAll(propertyId: string, query?: PaginationQuery): Promise<Tenant[]> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const renters = await prisma.renter.findMany({
      where: { propertyId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return renters as unknown as Tenant[];
  }

  async findById(id: string, propertyId: string): Promise<Tenant | null> {
    const renter = await prisma.renter.findFirst({
      where: { id, propertyId },
    });

    return renter as unknown as Tenant | null;
  }

  async update(
    id: string,
    propertyId: string,
    data: Partial<CreateTenantData>
  ): Promise<Tenant> {
    const existing = await prisma.renter.findFirst({
      where: { id, propertyId },
    });

    if (!existing) {
      throw new Error("Inquilino não encontrado para este imóvel");
    }

    const updated = await prisma.renter.update({
      where: { id },
      data,
    });

    return updated as unknown as Tenant;
  }

  async delete(id: string, propertyId: string): Promise<void> {
    const existing = await prisma.renter.findFirst({
      where: { id, propertyId },
    });

    if (!existing) {
      throw new Error("Inquilino não encontrado para este imóvel");
    }

    await prisma.renter.delete({
      where: { id },
    });
  }
}