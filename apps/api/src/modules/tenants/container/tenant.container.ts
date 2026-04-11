import { container } from "tsyringe";
import { TENANT_TOKENS } from "../tokens/tenant.tokens.js";
import { TenantService } from "../application/services/tenant.service.js";
import type { ITenantRepository } from "../domain/repositories/ITenantRepository.js";
import { PrismaTenantRepository } from "../infrastructure/prisma/repositories/PrismaTenantRepository.js";

container.register<ITenantRepository>(TENANT_TOKENS.Repository, {
  useClass: PrismaTenantRepository,
});

container.register(TENANT_TOKENS.Service, {
  useClass: TenantService,
});
