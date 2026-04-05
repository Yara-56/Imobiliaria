import { injectable, inject } from "tsyringe";

// ✅ CAMINHOS PARA SHARED (Sobe 4 níveis: services -> infra -> contracts -> modules -> src)
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

// ✅ CAMINHO PARA O LOGGER (Dentro de shared/core/logger)
import { logger } from "../../../src/core/logger/logger.js";

// ✅ INTERFACES E TOKENS DE CONTRATO (Dentro do módulo contracts)
// IContractRepository está em contracts/domain/repositories
import { IContractRepository } from "../domain/repositories/IContractRepository.js"; 
// CONTRACT_TOKENS está em contracts/tokens
import { CONTRACT_TOKENS } from "../tokens/contract.tokens.js";

// ✅ MÓDULO DE PROPRIEDADES (Irmão de contracts)
import { IPropertyRepository } from "../../properties/domain/repositories/IPropertyRepository.js";
import { PROPERTY_TOKENS } from "../../properties/tokens/property.tokens.js";

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

    // Validação de status (SaaS Guard)
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
      contractNumber: data.contractNumber ?? `CNT-${Date.now()}`,
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