import { Contract as PrismaContract } from "@prisma/client";
import { ContractEntity } from "../../../domain/entities/contract.entity";

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
      templateId: raw.templateId,
      rentAmount: Number(raw.rentAmount), // Converte Decimal do banco para Number
      dueDay: raw.dueDay,
      startDate: raw.startDate,
      endDate: raw.endDate,
      depositValue: raw.depositValue ? Number(raw.depositValue) : null,
      paymentMethod: raw.paymentMethod,
      status: raw.status,
      notes: raw.notes,
      generatedContent: raw.generatedContent,
      documentUrl: raw.documentUrl,
      signedUrl: raw.signedUrl,
      signedAt: raw.signedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  /**
   * 💾 De Domínio para Prisma (Salvar no Banco)
   */
  static toPersistence(contract: ContractEntity) {
    const data = contract.toJSON();
    
    // ✅ Agora 'data' possui templateId, depositValue e paymentMethod
    // O TypeScript não vai mais reclamar (ts2339)
    return {
      id: data.id,
      contractNumber: data.contractNumber,
      rentAmount: data.rentAmount,
      dueDay: data.dueDay,
      startDate: data.startDate,
      endDate: data.endDate,
      depositValue: data.depositValue,
      paymentMethod: data.paymentMethod,
      status: data.status,
      notes: data.notes,
      generatedContent: data.generatedContent,
      documentUrl: data.documentUrl,
      signedUrl: data.signedUrl,
      signedAt: data.signedAt,
      
      // Chaves estrangeiras e isolamento Multi-tenant
      tenantId: data.tenantId,
      propertyId: data.propertyId,
      renterId: data.renterId,
      userId: data.userId,
      templateId: data.templateId,
    };
  }
}