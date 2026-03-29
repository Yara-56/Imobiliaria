import { container } from "tsyringe";
import { TOKENS } from "../tokens";

import { ITenantRepository } from "@/modules/tenants/domain/repositories/ITenantRepository";
import { TenantRepository } from "@/modules/tenants/infra/repositories/TenantRepository";

/**
 * 🧠 Tenant Module - Dependency Injection
 *
 * Responsável por registrar todas as dependências do módulo de Tenants
 */
container.registerSingleton<ITenantRepository>(
  TOKENS.TenantRepository,
  TenantRepository
);