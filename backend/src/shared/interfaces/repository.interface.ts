export interface IBaseRepository<T> {
    create(data: any): Promise<T>;
    findAll(tenantId: string, query?: any): Promise<T[]>;
    findById(id: string, tenantId: string): Promise<T | null>;
    update(id: string, tenantId: string, data: any): Promise<T>;
    delete(id: string, tenantId: string): Promise<void>;
  }