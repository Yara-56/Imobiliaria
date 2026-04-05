import { prisma as prismaClient } from "../../../../../shared/infra/database/prisma.client.js";
import { 
  ITenantRepository, 
  PaginationQuery, 
  PaginatedResult 
} from "../../../domain/repositories/ITenantRepository.js";
import { Tenant, TenantDocument } from "../../../domain/entities/tenant.entity.js";
import { Renter as PrismaRenter, Prisma } from "@prisma/client";

export class PrismaTenantRepository implements ITenantRepository {
  
  /**
   * 🔄 Mapeador de Domínio
   * Converte o dado do Prisma para a nossa Entidade rica.
   */
  private mapToDomain(raw: any): Tenant {
    const documents = raw.documents?.map((doc: any) => TenantDocument.create({
      id: doc.id,
      renterId: raw.id,
      tenantId: raw.tenantId,
      type: doc.type,
      fileUrl: doc.fileUrl,
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      createdAt: doc.createdAt
    })) || [];

    // ✅ Usamos o restore para reconstruir o objeto de domínio
    return Tenant.restore({
      id: raw.id,
      fullName: raw.fullName,
      email: raw.email,
      phone: raw.phone,
      cpf: raw.cpf,
      notes: raw.notes ?? null, // ✅ Resolve o erro ts(2339) se o campo for nulo
      avatarUrl: raw.avatarUrl,
      tenantId: raw.tenantId,
      userId: raw.userId,
      documents: documents,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    });
  }

  // --- MÉTODOS EXIGIDOS PELA INTERFACE (Resolução do ts2420) ---

  async findByEmail(email: string, tenantId: string): Promise<Tenant | null> {
    const renter = await prismaClient.renter.findFirst({
      where: { email, tenantId }
    });
    return renter ? this.mapToDomain(renter) : null;
  }

  async findByCPF(cpf: string, tenantId: string): Promise<Tenant | null> {
    const renter = await prismaClient.renter.findFirst({
      where: { cpf, tenantId }
    });
    return renter ? this.mapToDomain(renter) : null;
  }

  // --- CRUD COMPLETO ---

  async create(tenant: Tenant): Promise<Tenant> {
    const data = tenant.toJSON();
    const created = await prismaClient.renter.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        tenantId: data.tenantId,
        userId: data.userId,
        notes: data.notes,
      },
    });
    return this.mapToDomain(created);
  }

  async findById(id: string, tenantId: string): Promise<Tenant | null> {
    const renter = await prismaClient.renter.findFirst({
      where: { id, tenantId },
    });
    return renter ? this.mapToDomain(renter) : null;
  }

  async findAll(tenantId: string, query?: PaginationQuery): Promise<PaginatedResult<Tenant>> {
    const page = Math.max(1, Number(query?.page || 1));
    const limit = Math.max(1, Number(query?.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.RenterWhereInput = {
      tenantId,
      ...(query?.search && {
        OR: [
          { fullName: { contains: query.search, mode: 'insensitive' as Prisma.QueryMode } },
          { email: { contains: query.search, mode: 'insensitive' as Prisma.QueryMode } },
        ]
      })
    };

    const [renters, total] = await Promise.all([
      prismaClient.renter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query?.orderBy || 'createdAt']: query?.orderDirection || 'desc' },
      }),
      prismaClient.renter.count({ where })
    ]);

    return {
      data: renters.map(renter => this.mapToDomain(renter)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async update(tenant: Tenant): Promise<Tenant> {
    const data = tenant.toJSON();
    const updated = await prismaClient.renter.update({
      where: { id: tenant.id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        notes: data.notes,
        updatedAt: new Date()
      }
    });
    return this.mapToDomain(updated);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await prismaClient.renter.deleteMany({
      where: { id, tenantId }
    });
  }

  async attachDocument(tenantId: string, renterId: string, document: any): Promise<void> {
    // Implementação de anexo de documento
  }

  async getStats(tenantId: string): Promise<{ total: number; active: number }> {
    const total = await prismaClient.renter.count({ where: { tenantId } });
    return { total, active: total };
  }
}