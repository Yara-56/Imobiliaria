import { PrismaClient } from '@prisma/client';
import { 
  IPropertyRepository, 
  CreatePropertyData, 
  UpdatePropertyData, 
  PropertyFilters 
} from '../../domain/repositories/IPropertyRepository';
import { Property } from '../../domain/entities/property.entity';

const prisma = new PrismaClient();

export class PropertyRepository implements IPropertyRepository {
  
  /**
   * ✅ Mapeamento Anti-Erro
   * Converte o modelo do Prisma (que permite null) para a Entidade Property (que exige tipos firmes).
   * Resolve o erro ts(2345) de city/state/price sendo null.
   */
  private mapToDomain(raw: any): Property {
    return new Property({
      ...raw,
      city: raw.city ?? "",               // Garante string para o domínio
      state: raw.state ?? "",             // Garante string para o domínio
      rentValue: Number(raw.price ?? 0),  // Mapeia price (DB) -> rentValue (Domínio)
      documentUrl: raw.documentUrl ?? null // Suporte para Escritura/PDF
    });
  }

  async create(data: CreatePropertyData): Promise<Property> {
    const created = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        price: data.rentValue,           // Mapeia rentValue -> price
        status: data.status || 'DISPONIVEL',
        tenantId: data.tenantId,
        userId: data.userId,
        documentUrl: data.documentUrl,    // ✅ Salva o caminho do PDF/Escritura
      }
    });

    return this.mapToDomain(created);
  }

  async update(id: string, tenantId: string, data: UpdatePropertyData): Promise<Property> {
    const updated = await prisma.property.update({
      where: { 
        id, 
        // tenantId: tenantId // Adicione se sua PK for composta
      },
      data: {
        ...data,
        // Se rentValue for enviado, mapeia para price no banco
        ...(data.rentValue && { price: data.rentValue })
      }
    });

    return this.mapToDomain(updated);
  }

  async findById(id: string, tenantId: string): Promise<Property | null> {
    const row = await prisma.property.findFirst({
      where: { id, tenantId }
    });

    return row ? this.mapToDomain(row) : null;
  }

  async findAll(tenantId: string, filters: PropertyFilters = {}): Promise<Property[]> {
    const { search, minPrice, maxPrice, status } = filters;

    const rows = await prisma.property.findMany({
      where: {
        tenantId,
        status: status,
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        OR: search ? [
          { title: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map(row => this.mapToDomain(row));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    // deleteMany garante que só apaga se o ID pertencer ao TenantId (Segurança)
    await prisma.property.deleteMany({
      where: { id, tenantId }
    });
  }

  async count(tenantId: string): Promise<number> {
    return prisma.property.count({
      where: { tenantId }
    });
  }
}