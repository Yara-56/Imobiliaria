import { prisma } from "../../../../config/database.config.js";

export class PrismaPropertyRepository {
  async findAll(tenantId: string) {
    return prisma.property.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, tenantId: string) {
    return prisma.property.findFirst({
      where: { id, tenantId },
    });
  }

  async create(data: any) {
    return prisma.property.create({ data });
  }

  async update(id: string, tenantId: string, data: any) {
    // updateMany é usado para garantir que o filtro tenantId seja respeitado na query
    await prisma.property.updateMany({
      where: { id, tenantId },
      data,
    });
    return this.findById(id, tenantId);
  }

  async delete(id: string, tenantId: string) {
    return prisma.property.deleteMany({
      where: { id, tenantId },
    });
  }
}