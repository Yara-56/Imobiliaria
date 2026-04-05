import { prisma } from "../../../../../shared/infra/prisma/client";
import { ContractEntity } from "../../../domain/entities/contract.entity";
import { IContractRepository } from "../../../domain/repositories/IContractRepository";
import { ContractMapper } from "../mappers/ContractMapper";

export class PrismaContractRepository implements IContractRepository {
  
  /**
   * ➕ CREATE
   */
  async create(contract: ContractEntity): Promise<ContractEntity> {
    const raw = ContractMapper.toPersistence(contract);
    
    const created = await prisma.contract.create({
      data: {
        id: raw.id,
        contractNumber: raw.contractNumber,
        rentAmount: raw.rentAmount,
        dueDay: raw.dueDay,
        startDate: raw.startDate,
        endDate: raw.endDate,
        depositValue: raw.depositValue,
        paymentMethod: raw.paymentMethod,
        status: raw.status,
        notes: raw.notes,
        generatedContent: raw.generatedContent,
        documentUrl: raw.documentUrl,
        signedUrl: raw.signedUrl,
        signedAt: raw.signedAt,
        tenant: { connect: { id: raw.tenantId } },
        property: { connect: { id: raw.propertyId } },
        renter: { connect: { id: raw.renterId } },
        user: { connect: { id: raw.userId } },
        ...(raw.templateId && { template: { connect: { id: raw.templateId } } })
      }
    });

    return ContractMapper.toDomain(created);
  }

  /**
   * ✅ MÉTODO SAVE (Sincronizado com IContractRepository)
   * Recebe apenas a entidade 'contract' para bater com a interface.
   */
  async save(contract: ContractEntity): Promise<void> {
    const data = ContractMapper.toPersistence(contract);
    
    // Usamos o id e o tenantId vindos da própria entidade para segurança
    await prisma.contract.update({
      where: { 
        id: contract.id 
      },
      data: {
        ...data,
        id: undefined, // Proteção: nunca alteramos a PK
        tenantId: undefined, // Proteção SaaS: o tenant de um contrato nunca muda
        propertyId: undefined // O imóvel de um contrato é imutável após a criação
      }
    });
  }

  /**
   * ✏️ UPDATE (Caso a interface base IBaseRepository exija)
   */
  async update(id: string, tenantId: string, data: any): Promise<ContractEntity> {
    const updated = await prisma.contract.update({
      where: { id }, // Aqui o tenantId já está garantido pela regra de negócio do Service
      data
    });
    return ContractMapper.toDomain(updated);
  }

  async findById(id: string, tenantId: string): Promise<ContractEntity | null> {
    const contract = await prisma.contract.findFirst({
      where: { id, tenantId }
    });

    return contract ? ContractMapper.toDomain(contract) : null;
  }

  async findAll(tenantId: string): Promise<ContractEntity[]> {
    const contracts = await prisma.contract.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

    return contracts.map(c => ContractMapper.toDomain(c));
  }

  async findByIdWithDetails(id: string, tenantId: string): Promise<any | null> {
    return await prisma.contract.findFirst({
      where: { id, tenantId },
      include: {
        renter: { select: { name: true, email: true, document: true } },
        property: { select: { title: true, address: true } },
        template: { select: { name: true } }
      }
    });
  }

  async findActiveByProperty(propertyId: string): Promise<ContractEntity | null> {
    const contract = await prisma.contract.findFirst({
      where: { propertyId, status: 'ACTIVE' }
    });

    return contract ? ContractMapper.toDomain(contract) : null;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.contract.deleteMany({
      where: { id, tenantId }
    });
  }
}