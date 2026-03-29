// src/modules/contracts/application/contract.service.ts

import { AppError } from "@/shared/errors/AppError.js";
import { logger } from "@/shared/utils/logger.js";
import { HttpStatus } from "@/shared/errors/http-status.js";

import { ContractRepository } from "../infra/repositories/contract.repository.js";
import { DocumentGeneratorService } from "../infra/document/document-generator.service.js";
// ✅ Removi temporariamente o import da assinatura se o arquivo não existir ou comentei para não travar o TS
// import { DigitalSignatureService } from "../infra/signature/digital-signature.service.js";

import { IContract, IContractInput } from "../domain/contract.types.js";

export class ContractService {
  private contractRepo = new ContractRepository();

  async getAllContracts(tenantId: string): Promise<IContract[]> {
    logger.debug({ msg: "Listando contratos", tenantId });

    if (!tenantId) {
      throw new AppError({ message: "Tenant inválido.", statusCode: HttpStatus.UNAUTHORIZED });
    }

    return this.contractRepo.findAll(tenantId);
  }

  async createContract(
    data: IContractInput,
    tenantId: string,
    userId: string
  ): Promise<IContract> {
    logger.info({ msg: "Criando contrato", tenantId, userId, payload: data });

    if (!tenantId || !userId) {
      throw new AppError({ message: "Usuário ou tenant inválido.", statusCode: HttpStatus.UNAUTHORIZED });
    }

    const normalized: any = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      rentAmount: Number(data.rentAmount),
      dueDay: Number(data.dueDay),
      depositValue: data.depositValue ? Number(data.depositValue) : null,
    };

    if (!normalized.renterId || !normalized.propertyId) {
      throw new AppError({ message: "Locatário e imóvel são obrigatórios.", statusCode: HttpStatus.BAD_REQUEST });
    }

    const contractNumber = data.contractNumber ?? `CNT-${new Date().getFullYear()}-${Date.now()}`;

    return await this.contractRepo.create({
      ...normalized,
      tenantId,
      userId,
      contractNumber,
      status: "DRAFT",
    });
  }

  async getContractById(contractId: string, tenantId: string): Promise<IContract> {
    if (!contractId || contractId === "undefined") {
      throw new AppError({ message: "ID inválido.", statusCode: HttpStatus.BAD_REQUEST });
    }

    const contract = await this.contractRepo.findById(contractId, tenantId);

    if (!contract) {
      throw new AppError({ message: "Contrato não encontrado.", statusCode: HttpStatus.NOT_FOUND });
    }

    return contract;
  }

  async updateContract(
    contractId: string,
    tenantId: string,
    updateData: Partial<IContractInput>
  ): Promise<IContract> {
    if (!contractId) {
      throw new AppError({ message: "ID inválido.", statusCode: HttpStatus.BAD_REQUEST });
    }

    // Lógica de filtragem e conversão de datas...
    const updated = await this.contractRepo.update(contractId, tenantId, updateData);

    if (!updated) {
      throw new AppError({ message: "Contrato inexistente ou sem permissão.", statusCode: HttpStatus.NOT_FOUND });
    }

    return updated;
  }

  async generateContractPDF(contractId: string, tenantId: string): Promise<Buffer> {
    const contract = await this.getContractById(contractId, tenantId);
    // ✅ Garanta que o DocumentGeneratorService tenha o método estático generatePDF
    return await DocumentGeneratorService.generatePDF(contract);
  }

  // Comentado para evitar erro ts(2307) até que o arquivo seja criado
  /*
  async sendToSignature(contractId: string, tenantId: string) {
    const contract = await this.getContractById(contractId, tenantId);
    return await DigitalSignatureService.requestSignature(contract);
  }
  */
}