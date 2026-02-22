import { prisma } from "../../../../infrastructure/database/prisma.client.js";
import { ITenantRepository, CreateTenantData } from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";

export class PrismaTenantRepository implements ITenantRepository {
  async create(data: CreateTenantData): Promise<Tenant> {
    const result = await prisma.tenant.create({
      data: {
        name: data.name,
        email: data.email,
        documentUrl: data.documentUrl,
        propertyId: data.propertyId,
      }
    });
    return result as unknown as Tenant;
  }

  async findAll(propertyId: string): Promise<Tenant[]> {
    return await prisma.tenant.findMany({ where: { propertyId } }) as unknown as Tenant[];
  }

  async findById(id: string, propertyId: string): Promise<Tenant | null> {
    return await prisma.tenant.findFirst({ where: { id, propertyId } }) as unknown as Tenant;
  }

  async update(id: string, propertyId: string, data: Partial<CreateTenantData>): Promise<Tenant> {
    return await prisma.tenant.update({ where: { id }, data: data as any }) as unknown as Tenant;
  }

  async delete(id: string, propertyId: string): Promise<void> {
    await prisma.tenant.delete({ where: { id } });
  }
}