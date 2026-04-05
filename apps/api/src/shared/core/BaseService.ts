export abstract class BaseService<T, CreateDTO, UpdateDTO> {
    constructor(protected repository: any) {}
  
    async create(data: CreateDTO): Promise<T> {
      return this.repository.create(data);
    }
  
    async findById(id: string): Promise<T | null> {
      return this.repository.findById(id);
    }
  
    async findAll(filters?: any): Promise<T[]> {
      return this.repository.findAll(filters);
    }
  
    async update(id: string, data: UpdateDTO): Promise<T> {
      return this.repository.update(id, data);
    }
  
    async delete(id: string): Promise<void> {
      return this.repository.delete(id);
    }
  }