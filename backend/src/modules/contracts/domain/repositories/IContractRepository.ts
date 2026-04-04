import { ContractEntity } from "../entities/contract.entity";

/**
 * ✅ INTERFACE ICONTRACTREPOSITORY
 * Define o contrato de persistência para o módulo de Contratos.
 * Foco: Isolamento Multi-tenant e integridade de dados.
 */
export interface IContractRepository {
  /**
   * ➕ Persistência Inicial
   */
  create(contract: ContractEntity): Promise<ContractEntity>;
  
  /**
   * 💾 Salva alterações em uma entidade existente
   * (Pode ser usado como alias para update ou save geral)
   */
  save(contract: ContractEntity): Promise<void>;

  /**
   * ✏️ ATUALIZAÇÃO (Necessário para o ContractService)
   * ✅ Resolve o erro ts(2339) no Service
   */
  update(id: string, tenantId: string, data: Partial<ContractEntity>): Promise<ContractEntity>;

  /**
   * 📄 LISTAGEM
   * Retorna todos os contratos de uma imobiliária (tenant)
   */
  findAll(tenantId: string): Promise<ContractEntity[]>;

  /**
   * 🔎 BUSCA SIMPLES
   */
  findById(id: string, tenantId: string): Promise<ContractEntity | null>;

  /**
   * 🔍 BUSCA DETALHADA (Join com Renter e Property)
   * Essencial para a tela de visualização de contrato no React
   */
  findByIdWithDetails(id: string, tenantId: string): Promise<any | null>;

  /**
   * 🏠 VALIDAÇÃO DE IMÓVEL
   * Verifica se o imóvel possui contrato ativo antes de permitir nova locação
   */
  findActiveByProperty(propertyId: string, tenantId: string): Promise<ContractEntity | null>;

  /**
   * 🗑️ REMOÇÃO (Isolada por tenant)
   */
  delete(id: string, tenantId: string): Promise<void>;
}