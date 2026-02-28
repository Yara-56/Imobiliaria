import { prisma } from "../../config/database.config.js";

export abstract class BaseRepository<T> {
  constructor(protected modelName: string) {}

  // Acesso protegido ao modelo dinâmico do Prisma
  protected get model() {
    const model = (prisma as any)[this.modelName];
    if (!model) {
      throw new Error(`Model ${this.modelName} não encontrado no Prisma Client.`);
    }
    return model;
  }

  async create(data: any): Promise<T> {
    return await this.model.create({ data });
  }

  async findById(id: string, tenantId?: string): Promise<T | null> {
    return await this.model.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
    });
  }

  async findAll(tenantId: string, options: any = {}): Promise<T[]> {
    const { skip, take, ...where } = options;
    return await this.model.findMany({
      where: {
        tenantId,
        ...where,
      },
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * ✅ MELHORIA: O Prisma update exige um ID único. 
   * Usamos updateMany para garantir o filtro de tenantId por segurança.
   */
  async update(id: string, tenantId: string, data: any): Promise<T> {
    // Primeiro atualizamos
    await this.model.updateMany({
      where: { id, tenantId },
      data,
    });

    // Depois buscamos o registro atualizado para retornar (padrão Repository)
    const updated = await this.findById(id, tenantId);
    if (!updated) throw new Error("Registro não encontrado para atualização.");
    
    return updated;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.model.deleteMany({
      where: { id, tenantId },
    });
  }

  async count(tenantId: string, where: any = {}): Promise<number> {
    return await this.model.count({
      where: { ...where, tenantId },
    });
  }
}