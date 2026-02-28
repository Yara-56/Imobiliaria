import { IBaseRepository } from "../interfaces/repository.interface.js";

export class BaseCrudService<T> {
  constructor(protected readonly repository: IBaseRepository<T>) {}

  async create(data: any): Promise<T> {
    return this.repository.create(data);
  }

  async findAll(tenantId: string, filters?: any): Promise<T[]> {
    return this.repository.findAll(tenantId, filters);
  }

  async findById(id: string, tenantId: string): Promise<T | null> {
    return this.repository.findById(id, tenantId);
  }

  async update(id: string, tenantId: string, data: any): Promise<T> {
    return this.repository.update(id, tenantId, data);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    return this.repository.delete(id, tenantId);
  }
}