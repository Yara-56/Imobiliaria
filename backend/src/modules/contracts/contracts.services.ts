import Contract, { IContract } from './contract.model.js';
import { AppError } from '../../shared/errors/AppError.js';

/**
 * Service de Contratos
 * Responsável por toda a regra de negócio e comunicação com o MongoDB.
 */
export const ContractService = {
  /**
   * Lista contratos garantindo o isolamento (Multi-tenancy)
   */
  async getAllContracts(tenantId: string): Promise<IContract[]> {
    // Filtramos sempre pelo tenantId para segurança
    return await Contract.find({ owner: tenantId }).sort({ createdAt: -1 });
  },

  /**
   * Cria um novo contrato vinculado ao admin logado
   */
  async createNewContract(data: Partial<IContract>, ownerId: string): Promise<IContract> {
    // Forçamos o ownerId vindo do token para evitar fraude
    const contract = await Contract.create({
      ...data,
      owner: ownerId
    });
    return contract;
  },

  /**
   * Busca um contrato específico com validação de posse
   */
  async getContractById(id: string, ownerId: string): Promise<IContract> {
    const contract = await Contract.findOne({ _id: id, owner: ownerId });

    if (!contract) {
      throw new AppError("Contrato não encontrado ou acesso negado.", 404);
    }

    return contract;
  },

  /**
   * Atualiza dados do contrato
   */
  async updateContract(id: string, ownerId: string, updateData: Partial<IContract>): Promise<IContract | null> {
    const contract = await Contract.findOneAndUpdate(
      { _id: id, owner: ownerId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!contract) {
      throw new AppError("Não foi possível atualizar: Contrato inexistente.", 404);
    }

    return contract;
  }
};