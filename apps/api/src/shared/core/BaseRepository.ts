import { IBaseRepository, PaginatedResult } from "./IBaseRepository.js";

export abstract class BaseRepository<T, CreateDTO = any, UpdateDTO = any> 
  implements IBaseRepository<T, CreateDTO, UpdateDTO> 
{
  constructor(protected readonly model: any) {}

  async create(data: CreateDTO): Promise<T> {
    return await this.model.create({ data });
  }

  async findById(id: string, tenantId?: string): Promise<T | null> {
    return await this.model.findFirst({
      where: { 
        id, 
        ...(tenantId && { tenantId }) 
      },
    });
  }

  async findAll(tenantId: string, query?: any): Promise<PaginatedResult<T>> {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { tenantId, ...query?.where };

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        take: limit,
        skip,
        orderBy: query?.orderBy || { createdAt: 'desc' }
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, tenantId: string, data: UpdateDTO): Promise<T> {
    return await this.model.update({
      where: { id, tenantId },
      data,
    });
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.model.delete({
      where: { id, tenantId },
    });
  }
}