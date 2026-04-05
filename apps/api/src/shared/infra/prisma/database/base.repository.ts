import { prisma } from "../../config/database.config.js";

interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
}

export abstract class BaseRepository<T> {
  // Recebe o nome do model (ex: 'user', 'property') para acessar via prisma[model]
  constructor(protected modelName: string) {}

  private get model() {
    return (prisma as any)[this.modelName];
  }

  async create(data: any) {
    return this.model.create({ data });
  }

  async findById(id: string, tenantId?: string) {
    return this.model.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
    });
  }

  async findAll(tenantId: string, options: PaginationOptions = {}) {
    const { page = 1, limit = 10, search, searchFields = [] } = options;

    // Construção do filtro para o Prisma
    const where: any = { tenantId };

    if (search && searchFields.length > 0) {
      where.OR = searchFields.map((field) => ({
        [field]: { contains: search, mode: "insensitive" },
      }));
    }

    const [total, data] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async update(id: string, tenantId: string, data: any) {
    return this.model.updateMany({
      where: { id, tenantId },
      data,
    });
  }

  async delete(id: string, tenantId: string) {
    return this.model.deleteMany({
      where: { id, tenantId },
    });
  }
}