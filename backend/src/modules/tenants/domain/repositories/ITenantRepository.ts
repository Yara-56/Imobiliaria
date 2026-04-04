import { Tenant } from "../entities/tenant.entity";

/**
 * 📥 DTO de Criação (Data Transfer Object)
 * ✅ Exportado para resolver o erro no Controller e Service
 */
export interface CreateTenantData {
  fullName: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  tenantId: string;
  userId: string;
}

/**
 * 🔎 Query de busca e paginação (Padrão SaaS)
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

/**
 * 🏢 Interface do Repositório de Inquilinos (Renters)
 * Foco: Isolamento multi-tenant e gestão de documentos.
 */
export interface ITenantRepository {
  /**
   * ➕ Criar novo inquilino (Renter)
   */
  create(tenant: Tenant): Promise<Tenant>;

  /**
   * 📄 Listar com paginação e busca (SaaS padrão)
   */
  findAll(
    tenantId: string, 
    query?: PaginationQuery
  ): Promise<PaginatedResult<Tenant>>;

  /**
   * 🔎 Buscar por ID (Isolado por imobiliária)
   */
  findById(id: string, tenantId: string): Promise<Tenant | null>;

  /**
   * 📧 Buscar por email (Único dentro da imobiliária)
   */
  findByEmail(email: string, tenantId: string): Promise<Tenant | null>;

  /**
   * 🪪 Buscar por CPF/CNPJ (Único dentro da imobiliária)
   */
  findByCPF(cpf: string, tenantId: string): Promise<Tenant | null>;

  /**
   * ✏️ Atualizar entidade completa
   */
  update(tenant: Tenant): Promise<Tenant>;

  /**
   * 🗑 Remover com isolamento multi-tenant
   */
  delete(id: string, tenantId: string): Promise<void>;

  /**
   * 📄 Gestão de Documentos (Contratos e Identidade)
   * Vincula a URL do arquivo diretamente ao perfil do inquilino no MongoDB
   */
  attachDocument(tenantId: string, renterId: string, document: {
    name: string;
    url: string;
    category: "CONTRACT" | "PERSONAL_DOC" | "RECEIPT";
  }): Promise<void>;

  /**
   * 📊 Métricas para Dashboard (Pronto para gráficos)
   */
  getStats(tenantId: string): Promise<{
    total: number;
    active: number;
  }>;
}