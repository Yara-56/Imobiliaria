import { PrismaClient } from '@prisma/client';
import {
  CreatePropertyData,
  UpdatePropertyData,
  IPropertyRepository,
} from '../../domain/repositories/IPropertyRepository';
import { Property } from '../../domain/entities/property.entity';

const prisma = new PrismaClient();

export class PropertyRepository implements IPropertyRepository {
  async create(data: CreatePropertyData): Promise<Property> {
    const created = await prisma.property.create({ data });
    return new Property(created);
  }

  async update(id: string, tenantId: string, data: UpdatePropertyData): Promise<Property> {
    const updated = await prisma.property.update({
      where: { id, tenantId },
      data,
    });
    return new Property(updated);
  }

  async findAll(tenantId: string, query: any = {}): Promise<Property[]> {
    const { page = 1, limit = 10, search = '' } = query;

    const rows = await prisma.property.findMany({
      where: {
        tenantId,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map(row => new Property(row));
  }

  async findById(id: string, tenantId: string): Promise<Property | null> {
    const row = await prisma.property.findFirst({ where: { id, tenantId } });
    return row ? new Property(row) : null;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.property.delete({ where: { id, tenantId } });
  }

  async count(tenantId: string): Promise<number> {
    return prisma.property.count({ where: { tenantId } });
  }
}