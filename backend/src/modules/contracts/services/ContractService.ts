import { injectable, inject } from "tsyringe";

// ✅ CORREÇÃO: Subindo 4 níveis para chegar em 'shared'
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatus } from "../../../shared/errors/http-status";
import { logger } from "../../../../src/core/logger/logger";

// ✅ CORREÇÃO: Caminhos para o domínio e tokens de Contracts (subindo 2 níveis)
import { IContractRepository } from "../domain/repositories/IContractRepository"; 
import { CONTRACT_TOKENS } from "../tokens/contract.tokens";

// ✅ CORREÇÃO: Caminho para o módulo de Properties (subindo 3 níveis até 'modules')
import { IPropertyRepository } from "../../properties/domain/repositories/IPropertyRepository";
// ✅ Cada token no seu devido lugar:
import { CONTRACT_TOKENS } from "../tokens/contract.tokens";
import { PROPERTY_TOKENS } from "../../properties/tokens/property.tokens";

@injectable()
export class ContractService {
  constructor(
    @inject(CONTRACT_TOKENS.Repository)
    private readonly contractRepo: IContractRepository,
    
    @inject(PROPERTY_TOKENS.Repository)
    private readonly propertyRepo: IPropertyRepository
  ) {}

  /**
   * 📄 CRIAÇÃO DE CONTRATO (Nível SaaS)
   */
  async createContract(data: any, tenantId: string, userId: string) {
    logger.info({ propertyId: data.propertyId, tenantId }, "📥 Iniciando criação de contrato");

    // 1. Verificar se o imóvel existe e está DISPONÍVEL
    const property = await this.propertyRepo.findById(data.propertyId, tenantId);
    
    if (!property) {
      throw new AppError({ 
        message: "Imóvel não encontrado.", 
        statusCode: HttpStatus.NOT_FOUND 
      });
    }

    if (property.status !== "AVAILABLE") {
      throw new AppError({
        message: "O imóvel selecionado não está disponível para locação.",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    // 2. Normalização de dados
    const contractData = {
      ...data,
      tenantId,
      userId,
      contractNumber: data.contractNumber ?? `REQ-${Date.now()}`,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      rentAmount: Number(data.rentAmount),
      dueDay: Number(data.dueDay || 10),
      status: "DRAFT", 
    };

    return await this.contractRepo.create(contractData);
  }

  /**
   * ⚡ ATIVAÇÃO DE CONTRATO
   */
  async activateContract(contractId: string, tenantId: string) {
    const contract = await this.contractRepo.findById(contractId, tenantId);

    if (!contract) {
      throw new AppError({ 
        message: "Contrato não encontrado.", 
        statusCode: HttpStatus.NOT_FOUND 
      });
    }

    // 🔄 Transação de Estado: Ativa o contrato e aluga o imóvel
    await this.contractRepo.update(contractId, tenantId, { status: "ACTIVE" });
    await this.propertyRepo.update(contract.propertyId, tenantId, { status: "RENTED" });

    logger.info({ contractId, propertyId: contract.propertyId }, "✅ Contrato Ativado e Imóvel Atualizado");
    
    return { message: "Contrato ativado com sucesso." };
  }
}