import { prisma } from "@shared/infra/prisma/client.js";
import { ContractEntity } from "../../../domain/entities/contract.entity.js";
import { IContractRepository } from "../../../domain/repositories/IContractRepository.js";
import { ContractMapper } from "../mappers/ContractMapper.js";

export class PrismaContractRepository implements IContractRepository {
  
  /**
   * ➕ CREATE
   */
  async create(contract: ContractEntity): Promise<ContractEntity> {
    const raw = ContractMapper.toPersistence(contract);
    
    const created = await prisma.contract.create({
      data: {
        contractNumber: raw.contractNumber,
        rentAmount: raw.rentAmount,
        dueDay: raw.dueDay,
        startDate: raw.startDate,
        endDate: raw.endDate,
        status: raw.status,
        tenant: { connect: { id: raw.tenantId } },
        property: { connect: { id: raw.propertyId } },
        renter: { connect: { id: raw.renterId } },
        user: { connect: { id: raw.userId } },
      },
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
        id: contract.id,
      },
      data: {
        contractNumber: data.contractNumber,
        rentAmount: data.rentAmount,
        dueDay: data.dueDay,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      },
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
        renter: { select: { fullName: true, email: true, cpf: true } },
        property: { select: { title: true, address: true } },
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