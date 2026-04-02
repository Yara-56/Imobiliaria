import { Tenant } from "../entities/tenant.entity.js";

/**
 * 🔎 Query de paginação + filtros
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: "fullName" | "createdAt";
  orderDirection?: "asc" | "desc";
}

/**
 * 📊 Resultado paginado (padrão enterprise)
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 🧾 Dados para criação (mais seguro que usar entidade direta)
 */
export interface CreateTenantDTO {
  fullName: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  tenantId: string;
  userId: string;
}

/**
 * ✏️ Dados para atualização
 */
export type UpdateTenantDTO = Partial<
  Omit<CreateTenantDTO, "tenantId" | "userId">
>;

/**
 * 🏢 Interface do Repository (Contrato do domínio)
 * Segue padrão DDD + Clean Architecture
 */
export interface ITenantRepository {
  /**
   * ➕ Criar novo inquilino
   */
  create(data: CreateTenantDTO): Promise<Tenant>;

  /**
   * 📄 Listar todos com paginação + busca
   */
  findAll(
    tenantId: string,
    query?: PaginationQuery
  ): Promise<PaginatedResult<Tenant>>;

  /**
   * 🔎 Buscar por ID (isolado por tenant)
   */
  findById(id: string, tenantId: string): Promise<Tenant | null>;

  /**
   * 📧 Buscar por email
   */
  findByEmail(
    email: string,
    tenantId: string
  ): Promise<Tenant | null>;

  /**
   * 🪪 Buscar por CPF
   */
  findByCPF(
    cpf: string,
    tenantId: string
  ): Promise<Tenant | null>;

  /**
   * ✏️ Atualizar
   */
  update(
    id: string,
    tenantId: string,
    data: UpdateTenantDTO
  ): Promise<Tenant>;

  /**
   * 🗑 Remover
   */
  delete(id: string, tenantId: string): Promise<void>;

  /**
   * 🔢 Contagem total (para dashboard)
   */
  count(tenantId: string): Promise<number>;
}