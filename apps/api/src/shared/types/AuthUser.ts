export type UserRole = "admin" | "corretor" | "cliente";

/**
 * Representa o usuário autenticado propagado pelo middleware `protect`.
 * Este tipo é utilizado em todo o backend SaaS multi-tenant.
 */
export interface AuthUser {
  /** ID do usuário autenticado */
  id: string;

  /** Papel do usuário no tenant (controle RBAC de permissões) */
  role: UserRole;

  /** Identificação do tenant isolado (multi-tenancy seguro) */
  tenantId: string;

  /** E-mail do usuário (útil para logs, auditoria, assinatura digital) */
  email?: string;

  /** Nome completo do usuário */
  name?: string;

  /** Quando a sessão expira (JWT exp) */
  sessionExpiresAt?: number;

  /** 
   * ID de sessão (ideal para auditoria, monitoramento, trilhas de acesso).
   * Gera logs profissionais: “userId X acting under session Y”.
   */
  sessionId?: string;

  /**
   * Permissões adicionais (ACLs)
   * Exemplo:
   * ["contract:create", "payment:view", "reports:access"]
   */
  permissions?: string[];

  /**
   * Filtros automáticos para auditoria e rastreamento de ações
   * Exemplo: {
   *   ip: "187.xxx.xxx.xxx",
   *   userAgent: "Chrome/115"
   * }
   */
  metadata?: {
    ip?: string;
    userAgent?: string;
  };
}