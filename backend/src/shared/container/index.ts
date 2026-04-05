import { container } from "tsyringe";

// --- MÓDULO DE CONTRATOS ---
import { CONTRACT_TOKENS } from "../../modules/contracts/tokens/contract.tokens";
import { IContractRepository } from "../../modules/contracts/domain/repositories/IContractRepository";
import { PrismaContractRepository } from "../../modules/contracts/infra/prima/repositories/PrismaContractRepository";

// --- MÓDULO DE PROPRIEDADES (Imóveis) ---
import { PROPERTY_TOKENS } from "../../modules/properties/tokens/property.tokens";
import { IPropertyRepository } from "../../modules/properties/domain/repositories/IPropertyRepository";
import { PrismaPropertyRepository } from "../../modules/properties/infrastructure/prima/repositories/PrismaPropertyRepository"; 

// --- MÓDULO DE TENANTS (Imobiliárias) ---
import { TENANT_TOKENS } from "../../modules/tenants/tokens/tenant.tokens";
import { ITenantRepository } from "../../modules/tenants/domain/repositories/ITenantRepository";
import { PrismaTenantRepository } from "../../modules/tenants/infrastructure/prisma/repositories/PrismaTenantRepository";

// --- MÓDULO DE USUÁRIOS ---
import { USER_TOKENS } from "../../modules/users/tokens/user.tokens";
import { IUserRepository } from "../../modules/users/domain/repositories/IUserRepository";
import { PrismaUserRepository } from "../../modules/users/infra/prisma/repositories/PrismaUserRepository";

/**
 * 💉 REGISTRO DE REPOSITÓRIOS (Dependency Injection)
 * Usamos registerSingleton para garantir que apenas uma instância de cada 
 * repositório exista na aplicação, economizando memória e conexões.
 */

// Contratos
container.registerSingleton<IContractRepository>(
  CONTRACT_TOKENS.Repository,
  PrismaContractRepository
);

// Imóveis
container.registerSingleton<IPropertyRepository>(
  PROPERTY_TOKENS.Repository,
  PrismaPropertyRepository
);

// Imobiliárias (Tenants)
container.registerSingleton<ITenantRepository>(
  TENANT_TOKENS.Repository,
  PrismaTenantRepository
);

// Usuários
container.registerSingleton<IUserRepository>(
  USER_TOKENS.Repository,
  PrismaUserRepository
);