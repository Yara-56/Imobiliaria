import type { Property as PrismaPropertyRow } from "@prisma/client";
import { prisma } from "@config/database.config.js";
import {
  IPropertyRepository,
  CreatePropertyData,
  UpdatePropertyData,
  PropertyFilters,
} from "../../../domain/repositories/IPropertyRepository.js";
import { Property } from "../../../domain/entities/property.entity.js";

export class PrismaPropertyRepository implements IPropertyRepository {
  private mapToDomain(raw: PrismaPropertyRow): Property {
    return new Property({
      id: raw.id,
      title: raw.title,
      description: null,
      address: raw.address,
      city: "",
      state: "",
      zipCode: null,
      rentValue: Number(raw.price ?? 0),
      status: raw.status,
      documentUrl: null,
      tenantId: raw.tenantId,
      userId: null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(data: CreatePropertyData): Promise<Property> {
    const addressLine = [data.address, data.city, data.state]
      .filter(Boolean)
      .join(", ");

    const created = await prisma.property.create({
      data: {
        title: data.title,
        address: addressLine,
        price: data.rentValue,
        status: data.status ?? "AVAILABLE",
        tenantId: data.tenantId,
      },
    });

    return this.mapToDomain(created);
  }

  async update(
    id: string,
    tenantId: string,
    data: UpdatePropertyData
  ): Promise<Property> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.rentValue !== undefined) updateData.price = data.rentValue;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.address || data.city || data.state) {
      updateData.address = [data.address, data.city, data.state]
        .filter(Boolean)
        .join(", ");
    }

    const updated = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    if (updated.tenantId !== tenantId) {
      throw new Error("Imóvel não pertence ao tenant informado");
    }

    return this.mapToDomain(updated);
  }

  async findById(id: string, tenantId: string): Promise<Property | null> {
    const row = await prisma.property.findFirst({
      where: { id, tenantId },
    });

    return row ? this.mapToDomain(row) : null;
  }

  async findAll(
    tenantId: string,
    filters: PropertyFilters = {}
  ): Promise<Property[]> {
    const { search, minPrice, maxPrice, status } = filters;

    const rows = await prisma.property.findMany({
      where: {
        tenantId,
        ...(status ? { status } : {}),
        ...(minPrice !== undefined || maxPrice !== undefined
          ? {
              price: {
                ...(minPrice !== undefined ? { gte: minPrice } : {}),
                ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
              },
            }
          : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => this.mapToDomain(row));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.property.deleteMany({
      where: { id, tenantId },
    });
  }

  async count(tenantId: string): Promise<number> {
    return prisma.property.count({
      where: { tenantId },
    });
  }
}
