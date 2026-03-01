import Contract, { IContract } from "../models/contract.model.js";
import { AppError } from "@shared/errors/AppError.js"; // ✅ Usando Alias profissional

/**
 * Service de Contratos
 * Camada de Regra de Negócio com Isolamento de Dados (Multi-tenancy)
 */
export const ContractService = {
  /**
   * Lista contratos garantindo o isolamento
   */
  async getAllContracts(ownerId: string): Promise<IContract[]> {
    // Filtramos sempre pelo owner para garantir que um admin não veja dados de outro
    return await Contract.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .lean(); // ✅ Melhora performance ao retornar objetos JS puros
  },

  /**
   * Cria um novo contrato vinculado ao admin logado
   */
  async createNewContract(
    data: Partial<IContract>,
    ownerId: string
  ): Promise<IContract> {
    // Sobrescrevemos o owner com o ID vindo do token (Segurança contra Injeção)
    return await Contract.create({
      ...data,
      owner: ownerId,
    });
  },

  /**
   * Busca um contrato específico com validação de posse
   */
  async getContractById(id: string, ownerId: string): Promise<IContract> {
    const contract = await Contract.findOne({ _id: id, owner: ownerId }).lean();

    if (!contract) {
      throw new AppError("Contrato não encontrado ou acesso negado.", 404);
    }

    return contract as IContract;
  },

  /**
   * Atualiza dados do contrato
   */
  async updateContract(
    id: string,
    ownerId: string,
    updateData: Partial<IContract>
  ): Promise<IContract> {
    const contract = await Contract.findOneAndUpdate(
      { _id: id, owner: ownerId },
      { $set: updateData }, // ✅ Uso explícito de $set para segurança
      { new: true, runValidators: true }
    ).lean();

    if (!contract) {
      throw new AppError(
        "Não foi possível atualizar: Contrato inexistente ou sem permissão.",
        404
      );
    }

    return contract as IContract;
  },
};