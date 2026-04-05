/**
 * 🏗️ BaseCrudService
 * Uma base sólida para todos os serviços do sistema.
 * T: Tipo da Entidade (ex: Payment, Contract)
 */
export class BaseCrudService<T> {
  // Mudamos para 'protected' para que serviços que herdam desta classe
  // possam acessar o repository se precisarem de lógica customizada.
  constructor(protected readonly repository: any) {}

  async create(data: Partial<T>): Promise<T> {
    // Aqui você pode adicionar validações globais antes de salvar
    return this.repository.create(data);
  }

  async findAll(tenantId: string, filters?: any): Promise<T[]> {
    // Forçamos o tenantId para garantir isolamento de dados
    return this.repository.findAll(tenantId, filters);
  }

  async findById(id: string, tenantId: string): Promise<T | null> {
    const record = await this.repository.findById(id, tenantId);
    if (!record) {
      throw new Error("Registro não encontrado ou acesso não autorizado.");
    }
    return record;
  }

  async update(id: string, tenantId: string, data: Partial<T>): Promise<T | null> {
    // Verifica se existe antes de atualizar
    await this.findById(id, tenantId);
    return this.repository.update(id, tenantId, data);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    // Verifica se existe e pertence ao tenant antes de deletar
    await this.findById(id, tenantId);
    await this.repository.delete(id, tenantId);
  }
}