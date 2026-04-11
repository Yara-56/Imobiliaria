import { User, Prisma } from "@prisma/client";

/**
 * 🔎 Query de busca e paginação (Padrão SaaS)
 * Incluímos campos opcionais para filtros de data e status, comuns em Dashboards.
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * 📊 Resultado paginado profissional
 * Estrutura padrão para o Frontend (React/Next.js) construir tabelas.
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

/**
 * 📜 Interface do Repositório de Usuários
 * Foco: Gestão de acesso e ISOLAMENTO TOTAL por imobiliária (Multi-tenant).
 */
export interface IUserRepository {
  /**
   * ➕ Criação usando os tipos nativos do Prisma para evitar erros de campo.
   */
  create(data: Prisma.UserCreateInput): Promise<User>;
  
  /**
   * 💾 Persistência de entidade completa.
   */
  save(user: User): Promise<User>;

  /**
   * 🆔 Busca por ID com trava de Tenant.
   * ✅ CRITICAL: Em SaaS, quase nunca buscamos só por ID, sempre ID + TenantId.
   */
  findById(id: string, tenantId: string): Promise<User | null>;

  /**
   * 📧 Busca global por e-mail (geralmente usado no Login).
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * 📄 Listagem paginada e filtrada com isolamento de dados.
   */
  findAll(
    tenantId: string, 
    query?: PaginationQuery
  ): Promise<PaginatedResult<User>>;

  /**
   * ✏️ Atualização parcial ou total de campos.
   */
  update(id: string, tenantId: string, data: Prisma.UserUpdateInput): Promise<User>;

  /**
   * 🗑️ Remoção definitiva com trava de segurança.
   */
  delete(id: string, tenantId: string): Promise<void>;

  /**
   * 📊 Contagem rápida para estatísticas do dashboard.
   */
  count(tenantId: string): Promise<number>;
}