export class BaseCrudService<T> {
    constructor(private repository: any) {}
  
    async create(data: any): Promise<T> {
      return this.repository.create(data);
    }
  
    async findAll(filters?: any): Promise<T[]> {
      return this.repository.findAll(filters);
    }
  
    async findById(id: string): Promise<T | null> {
      return this.repository.findById(id);
    }
  
    async update(id: string, data: any): Promise<T | null> {
      return this.repository.update(id, data);
    }
  
    async delete(id: string): Promise<void> {
      await this.repository.delete(id);
    }
  }