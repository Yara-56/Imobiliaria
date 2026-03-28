// src/modules/contracts/application/contract.service.ts

import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";

import { ContractRepository } from "@/modules/contracts/infra/repositories/contract.repository";
import { DocumentGeneratorService } from "@/modules/contracts/infra/document/document-generator.service";
import { DigitalSignatureService } from "@/modules/contracts/infra/signature/digital-signature.service";

import { IContract, IContractInput } from "@/modules/contracts/domain/contract.types";

/**
 * Serviço de negócios do módulo de Contratos
 */
export class ContractService {
  private contractRepo = new ContractRepository();

  async getAllContracts(tenantId: string): Promise<IContract[]> {
    logger.debug({ msg: "Listando contratos", tenantId });

    if (!tenantId) throw new AppError("Tenant inválido.", 401);

    return this.contractRepo.findAll(tenantId);
  }

  async createContract(
    data: IContractInput,
    tenantId: string,
    userId: string
  ): Promise<IContract> {
    logger.info({
      msg: "Criando contrato",
      tenantId,
      userId,
      payload: data,
    });

    if (!tenantId || !userId) {
      throw new AppError("Usuário ou tenant inválido.", 401);
    }

    const normalized: IContractInput = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      rentAmount: Number(data.rentAmount),
      dueDay: Number(data.dueDay),
      depositValue: data.depositValue ? Number(data.depositValue) : null,
    };

    if (!normalized.renterId || !normalized.propertyId) {
      throw new AppError("Locatário e imóvel são obrigatórios.", 400);
    }

    const contractNumber =
      data.contractNumber ??
      `CNT-${new Date().getFullYear()}-${Date.now()}`;

    const created = await this.contractRepo.create({
      ...normalized,
      tenantId,
      userId,
      contractNumber,
      status: "DRAFT",
    });

    return created;
  }

  async getContractById(
    contractId: string,
    tenantId: string
  ): Promise<IContract> {
    if (!contractId || contractId === "undefined") {
      throw new AppError("ID inválido.", 400);
    }

    const contract = await this.contractRepo.findById(contractId, tenantId);

    if (!contract) {
      throw new AppError("Contrato não encontrado.", 404);
    }

    return contract;
  }

  async updateContract(
    contractId: string,
    tenantId: string,
    updateData: Partial<IContractInput>
  ): Promise<IContract> {
    if (!contractId) {
      throw new AppError("ID inválido.", 400);
    }

    const allowedFields = [
      "rentAmount",
      "dueDay",
      "startDate",
      "endDate",
      "depositValue",
      "paymentMethod",
      "notes",
      "status",
    ];

    const filteredUpdates = Object.fromEntries(
      Object.entries(updateData).filter(([key]) =>
        allowedFields.includes(key)
      )
    );

    if (filteredUpdates.startDate) {
      filteredUpdates.startDate = new Date(filteredUpdates.startDate);
    }
    if (filteredUpdates.endDate) {
      filteredUpdates.endDate = new Date(filteredUpdates.endDate);
    }

    const updated = await this.contractRepo.update(
      contractId,
      tenantId,
      filteredUpdates
    );

    if (!updated) {
      throw new AppError("Contrato inexistente ou sem permissão.", 404);
    }

    return updated;
  }

  async generateContractPDF(
    contractId: string,
    tenantId: string
  ): Promise<Buffer> {
    const contract = await this.getContractById(contractId, tenantId);

    return await DocumentGeneratorService.generatePDF(contract);
  }

  async sendToSignature(contractId: string, tenantId: string) {
    const contract = await this.getContractById(contractId, tenantId);

    return await DigitalSignatureService.requestSignature(contract);
  }

  async finalizeSignedContract(contractId: string, signedFileUrl: string) {
    return await this.contractRepo.update(contractId, undefined, {
      status: "ACTIVE",
      signedUrl: signedFileUrl,
    });
  }
}