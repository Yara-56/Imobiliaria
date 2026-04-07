/**
 * 🔎 Query de busca e paginação (Padrão SaaS)
 * Define os parâmetros que o Frontend pode enviar para filtrar tabelas.
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

/**
 * 📊 Resultado paginado profissional
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IBaseRepository<T, CreateDTO = any, UpdateDTO = any> {
  create(data: CreateDTO): Promise<T>;
  findById(id: string, tenantId?: string): Promise<T | null>;
  findAll(tenantId: string, query?: PaginationQuery): Promise<PaginatedResult<T>>;
  update(id: string, tenantId: string, data: UpdateDTO): Promise<T>;
  delete(id: string, tenantId: string): Promise<void>;
}