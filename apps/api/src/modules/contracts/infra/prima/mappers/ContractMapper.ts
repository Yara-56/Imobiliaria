import {
  Contract as PrismaContract,
  PaymentMethod,
} from "@prisma/client";
import { ContractEntity } from "../../../domain/entities/contract.entity.js";

/**
 * ✅ MAPPER DE CONTRATO (Data Mapper Pattern)
 * Responsável por traduzir dados entre a camada de Persistência (Prisma)
 * e a camada de Domínio (Entidade).
 */
export class ContractMapper {
  /**
   * 🏦 De Prisma para Domínio (Busca no Banco)
   */
  static toDomain(raw: PrismaContract): ContractEntity {
    return ContractEntity.restore({
      id: raw.id,
      contractNumber: raw.contractNumber ?? "",
      tenantId: raw.tenantId,
      propertyId: raw.propertyId,
      renterId: raw.renterId,
      userId: raw.userId,
      templateId: null,
      rentAmount: Number(raw.rentAmount),
      dueDay: raw.dueDay,
      startDate: raw.startDate,
      endDate: raw.endDate,
      depositValue: null,
      paymentMethod: PaymentMethod.PIX,
      status: raw.status,
      notes: null,
      generatedContent: null,
      documentUrl: null,
      signedUrl: null,
      signedAt: null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  /**
   * 💾 De Domínio para Prisma (Salvar no Banco)
   */
  static toPersistence(contract: ContractEntity) {
    const data = contract.toJSON();

    return {
      id: data.id,
      contractNumber: data.contractNumber,
      rentAmount: data.rentAmount,
      dueDay: data.dueDay,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      tenantId: data.tenantId,
      propertyId: data.propertyId,
      renterId: data.renterId,
      userId: data.userId,
    };
  }
}