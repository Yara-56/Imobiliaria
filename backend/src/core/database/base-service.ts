export abstract class BaseService<T> {
    constructor(protected repository: any) {}
  
    create(data: Partial<T>) {
      return this.repository.create(data);
    }
  
    async findAll(tenantId: string, query: any) {
      return this.repository.findAll(tenantId, query);
    }
  
    findById(id: string, tenantId: string) {
      return this.repository.findById(id, tenantId);
    }
  
    update(id: string, tenantId: string, data: Partial<T>) {
      return this.repository.update(id, tenantId, data);
    }
  
    delete(id: string, tenantId: string) {
      return this.repository.delete(id, tenantId);
    }
  }