import { injectable, inject } from "tsyringe";
import {
  PaymentMethod,
  PropertyStatus,
  ContractStatus,
} from "@prisma/client";

import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";

import { logger } from "@shared/utils/logger.js";

import type { IContractRepository } from "../domain/repositories/IContractRepository.js";
import { CONTRACT_TOKENS } from "../tokens/contract.tokens.js";
import { ContractEntity } from "../domain/entities/contract.entity.js";

import type { IPropertyRepository } from "../../properties/domain/repositories/IPropertyRepository.js";
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
  async createContract(data: {
    propertyId: string;
    renterId: string;
    rentAmount: number;
    dueDay?: number;
    startDate: Date | string;
    endDate?: Date | string | null;
  }, tenantId: string, userId: string) {
    logger.info({ propertyId: data.propertyId, tenantId }, "📥 Iniciando criação de contrato");

    const property = await this.propertyRepo.findById(data.propertyId, tenantId);

    if (!property) {
      throw new AppError({
        message: "Imóvel não encontrado.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    if (property.status !== PropertyStatus.AVAILABLE) {
      throw new AppError({
        message: "O imóvel selecionado não está disponível para locação.",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const entity = ContractEntity.create({
      tenantId,
      userId,
      propertyId: data.propertyId,
      renterId: data.renterId,
      templateId: null,
      rentAmount: Number(data.rentAmount),
      dueDay: Number(data.dueDay ?? 10),
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      paymentMethod: PaymentMethod.PIX,
      notes: null,
    });

    return await this.contractRepo.create(entity);
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
    await this.contractRepo.update(contractId, tenantId, {
      status: ContractStatus.ACTIVE,
    } as Partial<ContractEntity>);
    await this.propertyRepo.update(contract.propertyId, tenantId, {
      status: PropertyStatus.RENTED,
    });

    logger.info({ contractId, propertyId: contract.propertyId }, "✅ Contrato Ativado e Imóvel Atualizado");
    
    return { message: "Contrato ativado com sucesso." };
  }
}