import { prisma } from "../../config/database.config.js";

export abstract class BaseRepository<T> {
  constructor(protected modelName: string) {}

  // ✅ Definindo como 'protected' para que o UserRepository consiga acessar
  protected get model() {
    return (prisma as any)[this.modelName];
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async findById(id: string, tenantId?: string): Promise<T | null> {
    return this.model.findFirst({
      where: { id, ...(tenantId && { tenantId }) },
    });
  }

  async findAll(tenantId: string, options: any = {}): Promise<T[]> {
    return this.model.findMany({
      where: { tenantId, ...options },
    });
  }

  async update(id: string, tenantId: string, data: any): Promise<T> {
    return this.model.updateMany({
      where: { id, tenantId },
      data,
    });
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.model.deleteMany({
      where: { id, tenantId },
    });
  }
}