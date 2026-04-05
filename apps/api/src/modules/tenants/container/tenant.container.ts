import { container } from "tsyringe";
import { TENANT_TOKENS } from "../tokens/tenant.tokens.js";

import { TenantService } from "../application/services/tenant.service.js";
import { TenantRepository } from "../domain/repositories/tenant.repository.interface.js";

// Repository
container.register(TENANT_TOKENS.Repository, {
  useClass: TenantRepository,
});

// Service
container.register(TENANT_TOKENS.Service, {
  useClass: TenantService,
});
