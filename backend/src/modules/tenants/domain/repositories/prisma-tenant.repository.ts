import { prisma } from "../../../../infrastructure/database/prisma.client.js";
import {
  ITenantRepository,
  CreateTenantData,
  PaginationQuery,
} from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";

export class PrismaTenantRepository implements ITenantRepository {
  async create(data: CreateTenantData): Promise<Tenant> {
    if (!data.fullName?.trim()) {
      throw new Error("O nome do locatário é obrigatório para criação.");
    }

    const result = await prisma.renter.create({
      data: {
        fullName: data.fullName.trim(),
        email: data.email ?? null,
        phone: data.phone ?? null,
        cpf: data.cpf ?? null,
        documentUrl: data.documentUrl ?? null,
        notes: data.notes ?? null,
        propertyId: data.propertyId ?? null,
        tenantId: data.tenantId,
      },
    });

    return result as unknown as Tenant;
  }

  async findAll(tenantId: string, query?: PaginationQuery): Promise<Tenant[]> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const renters = await prisma.renter.findMany({
      where: {
        tenantId,
        ...(query?.search && {
          fullName: { contains: query.search, mode: "insensitive" },
        }),
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return renters as unknown as Tenant[];
  }

  async findById(id: string, tenantId: string): Promise<Tenant | null> {
    const renter = await prisma.renter.findFirst({
      where: { id, tenantId },
    });

    return renter as unknown as Tenant | null;
  }

  async update(
    id: string,
    tenantId: string,
    data: Partial<CreateTenantData>
  ): Promise<Tenant> {
    const existing = await prisma.renter.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Inquilino não encontrado");
    }

    const updated = await prisma.renter.update({
      where: { id },
      data,
    });

    return updated as unknown as Tenant;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    const existing = await prisma.renter.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Inquilino não encontrado");
    }

    await prisma.renter.delete({
      where: { id },
    });
  }
}