import { prisma } from "@config/database.config.js"; 
import { 
  IPropertyRepository, 
  CreatePropertyData, 
  UpdatePropertyData, 
  PropertyFilters 
} from "../../../domain/repositories/IPropertyRepository.js";

// ✅ CORREÇÃO AQUI: Subindo os níveis para chegar em domain/entities
import { Property } from "../../../domain/entities/property.entity.js"; 

/**
 * 🏠 PrismaPropertyRepository
 * Implementação profissional de repositório para o módulo de Imóveis.
 */
export class PrismaPropertyRepository implements IPropertyRepository {
  
  /**
   * ✅ Mapeamento Anti-Erro (Data Mapper Pattern)
   */
  private mapToDomain(raw: any): Property {
    return new Property({
      ...raw,
      city: raw.city ?? "",               
      state: raw.state ?? "",             
      price: Number(raw.price ?? 0),  // Mapeia o campo do DB
      documentUrl: raw.documentUrl ?? null 
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
        price: data.rentValue,           
        status: data.status || 'AVAILABLE', // 💡 Use AVAILABLE (Inglês) para bater com o Prisma
        tenantId: data.tenantId,
        userId: data.userId,
        documentUrl: data.documentUrl,    
      }
    });

    return this.mapToDomain(created);
  }

  async update(id: string, tenantId: string, data: UpdatePropertyData): Promise<Property> {
    const updateData: any = { ...data };
    if (data.rentValue) {
      updateData.price = data.rentValue;
      delete updateData.rentValue;
    }

    const updated = await prisma.property.update({
      where: { id }, 
      data: updateData
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
        status: status as any,
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
          ]
        }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map(row => this.mapToDomain(row));
  }

  async delete(id: string, tenantId: string): Promise<void> {
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