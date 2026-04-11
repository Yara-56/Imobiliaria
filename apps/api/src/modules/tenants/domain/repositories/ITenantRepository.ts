import { Tenant } from "../entities/tenant.entity.js";
import type {
  PaginationQuery,
  PaginatedResult,
} from "@shared/core/IBaseRepository.js";

export type { PaginationQuery, PaginatedResult };

/**
 * 📥 CreateTenantData
 * DTO para persistência inicial do inquilino.
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
 * 🏢 ITenantRepository
 * Foco: Isolamento multi-tenant rigoroso e gestão documental.
 */
export interface ITenantRepository {
  /**
   * ➕ Criar novo inquilino (Renter)
   */
  create(tenant: Tenant): Promise<Tenant>;

  /**
   * 📄 Listar com paginação e busca scoped
   * 🔒 Segurança: O tenantId garante que a Imobiliária Lacerda nunca veja inquilinos de outra.
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
   * 📧 Buscar por email (Único por contexto de imobiliária)
   */
  findByEmail(email: string, tenantId: string): Promise<Tenant | null>;

  /**
   * 🪪 Buscar por CPF/CNPJ (Segurança de dados)
   */
  findByCPF(cpf: string, tenantId: string): Promise<Tenant | null>;

  /**
   * ✏️ Atualizar entidade completa
   */
  update(tenant: Tenant): Promise<Tenant>;

  /**
   * 🗑 Remover com isolamento total
   */
  delete(id: string, tenantId: string): Promise<void>;

  /**
   * 📄 Gestão de Documentos (Contratos e Identidade)
   * Nível Pro: Vincula metadados de arquivos (S3/Cloudinary) ao perfil.
   */
  attachDocument(tenantId: string, renterId: string, document: {
    name: string;
    url: string;
    category: "CONTRACT" | "PERSONAL_DOC" | "RECEIPT";
  }): Promise<void>;

  /**
   * 📊 Métricas para Dashboard (KPIs da HomeFlux)
   */
  getStats(tenantId: string): Promise<{
    total: number;
    active: number;
  }>;
}