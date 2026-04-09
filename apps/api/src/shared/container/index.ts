import "reflect-metadata";
import { container } from "tsyringe";

/**
 * ========================================
 * 📄 MÓDULO DE CONTRATOS
 * ========================================
 */
import { CONTRACT_TOKENS } from "@modules/contracts/tokens/contract.tokens.js";
import type { IContractRepository } from "@modules/contracts/domain/repositories/IContractRepository.js";
import { PrismaContractRepository } from "@modules/contracts/infra/prima/repositories/PrismaContractRepository.js";

/**
 * ========================================
 * 🏠 MÓDULO DE PROPRIEDADES
 * ========================================
 */
import { PROPERTY_TOKENS } from "@modules/properties/tokens/property.tokens.js";
import type { IPropertyRepository } from "@modules/properties/domain/repositories/IPropertyRepository.js";
import { PrismaPropertyRepository } from "@modules/properties/infrastructure/prima/repositories/PrismaPropertyRepository.js";
import { PropertyService } from "@modules/properties/services/PropertyService.js";

/**
 * ========================================
 * 🏢 MÓDULO DE TENANTS
 * ========================================
 */
import { TENANT_TOKENS } from "@modules/tenants/tokens/tenant.tokens.js";
import type { ITenantRepository } from "@modules/tenants/domain/repositories/ITenantRepository.js";
import { PrismaTenantRepository } from "@modules/tenants/infrastructure/prisma/repositories/PrismaTenantRepository.js";

/**
 * ========================================
 * 👤 MÓDULO DE USUÁRIOS
 * ========================================
 */
import { USER_TOKENS } from "@modules/users/tokens/user.tokens.js";
import type { IUserRepository } from "@modules/users/domain/repositories/IUserRepository.js";
import { PrismaUserRepository } from "@modules/users/infra/prisma/repositories/PrismaUserRepository.js";

/**
 * ========================================
 * 💉 REGISTRO DE REPOSITÓRIOS
 * ========================================
 */

// 📄 CONTRATOS
container.registerSingleton<IContractRepository>(
  CONTRACT_TOKENS.Repository,
  PrismaContractRepository
);

// 🏠 PROPRIEDADES
container.registerSingleton<IPropertyRepository>(
  PROPERTY_TOKENS.Repository,
  PrismaPropertyRepository
);

// 🏢 TENANTS
container.registerSingleton<ITenantRepository>(
  TENANT_TOKENS.Repository,
  PrismaTenantRepository
);

// 👤 USUÁRIOS
container.registerSingleton<IUserRepository>(
  USER_TOKENS.Repository,
  PrismaUserRepository
);

/**
 * ========================================
 * 💉 REGISTRO DE SERVICES
 * ========================================
 */

// 🏠 PROPRIEDADES
container.registerSingleton(
  PROPERTY_TOKENS.Service,
  PropertyService
);

/**
 * ========================================
 * 🔍 DEBUG (REMOVA DEPOIS)
 * ========================================
 */
console.log("🔥 Container carregado com sucesso");

/**
 * ========================================
 * ✅ EXPORT
 * ========================================
 */
export { container };