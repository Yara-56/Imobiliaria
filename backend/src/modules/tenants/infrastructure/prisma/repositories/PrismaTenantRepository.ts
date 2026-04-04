import { prisma } from "../../../../infrastructure/database/prisma.client.js";
import { 
  ITenantRepository, 
  CreateTenantData, 
  UpdateTenantData,
  PaginationQuery 
} from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";
import { Renter as PrismaRenter } from "@prisma/client";

export class PrismaTenantRepository implements ITenantRepository {
  
  /**
   * 🔄 Mapeador de Domínio
   * Converte o objeto do Prisma (banco) para a nossa Classe de Domínio.
   */
  private mapToDomain(raw: PrismaRenter): Tenant {
    // Convertemos para 'any' temporariamente para acessar propriedades 
    // recém-criadas no Schema que o TS ainda não mapeou no Client.
    const data = raw as any;

    return new Tenant({
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      tenantId: data.tenantId,
      userId: data.userId || null, // ✅ Resolve o erro ts(2339)
      status: data.status,
      documentUrl: data.documentUrl,
      notes: data.notes,
      propertyId: data.propertyId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  async create(data: CreateTenantData): Promise<Tenant> {
    const created = await prisma.renter.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        tenantId: data.tenantId,
        userId: data.userId, // ✅ Agora aceito pelo Prisma
        documentUrl: data.documentUrl,
        notes: data.notes,
        propertyId: data.propertyId,
      },
    });

    return this.mapToDomain(created);
  }

  async findByEmail(email: string, tenantId: string): Promise<Tenant | null> {
    const renter = await prisma.renter.findFirst({
      where: { email, tenantId },
    });
    return renter ? this.mapToDomain(renter) : null;
  }

  async findByCPF(cpf: string, tenantId: string): Promise<Tenant | null> {
    const renter = await prisma.renter.findFirst({
      where: { cpf, tenantId },
    });
    return renter ? this.mapToDomain(renter) : null;
  }

  async findById(id: string, tenantId: string): Promise<Tenant | null> {
    const renter = await prisma.renter.findFirst({
      where: { id, tenantId },
    });
    return renter ? this.mapToDomain(renter) : null;
  }

  async findAll(tenantId: string, query?: PaginationQuery): Promise<Tenant[]> {
    const page = Number(query?.page || 1);
    const limit = Number(query?.limit || 10);

    const renters = await prisma.renter.findMany({
      where: {
        tenantId,
        OR: query?.search ? [
          { fullName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ] : undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return renters.map(renter => this.mapToDomain(renter));
  }

  async update(id: string, tenantId: string, data: UpdateTenantData): Promise<Tenant> {
    const updated = await prisma.renter.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        documentUrl: data.documentUrl,
        notes: data.notes,
        propertyId: data.propertyId,
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.renter.deleteMany({
      where: { id, tenantId },
    });
  }

  async count(tenantId: string): Promise<number> {
    return await prisma.renter.count({
      where: { tenantId },
    });
  }
}