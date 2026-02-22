// CAMINHO: backend/src/modules/tenants/application/services/tenant.service.ts

// CORREÇÃO: Subimos dois níveis (../../) para sair de 'services' e 'application' 
// e então entrar em 'infrastructure'
import { TenantRepository } from "../../infrastructure/database/tenant.repository.js";

export class TenantService {
  // Instanciando o repositório correto conforme sua estrutura de arquivos
  constructor(private repo = new TenantRepository()) {}

  async create(data: any) {
    return this.repo.create(data);
  }

  async findAll(tenantId: string, params: any) {
    return this.repo.findAll(tenantId, params);
  }

  async findById(id: string, tenantId: string) {
    return this.repo.findById(id, tenantId);
  }

  async update(id: string, tenantId: string, data: any) {
    return this.repo.update(id, tenantId, data);
  }

  async delete(id: string, tenantId: string) {
    return this.repo.delete(id, tenantId);
  }
}