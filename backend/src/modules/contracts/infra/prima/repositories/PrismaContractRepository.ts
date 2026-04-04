import { prisma } from "@infra/prisma/client";
import { ContractEntity } from "../../../domain/entities/contract.entity";
import { IContractRepository } from "../../../domain/repositories/IContractRepository";
import { ContractMapper } from "../mappers/ContractMapper";

export class PrismaContractRepository implements IContractRepository {
  
  async create(contract: ContractEntity): Promise<void> {
    const data = ContractMapper.toPersistence(contract);
    
    await prisma.contract.create({
      data: {
        ...data,
        tenant: { connect: { id: contract.tenantId } },
        property: { connect: { id: contract.propertyId } },
        renter: { connect: { id: contract.renterId } },
        template: { connect: { id: contract.templateId } },
        user: { connect: { id: contract.userId } },
      }
    });
  }

  async findById(id: string, tenantId: string): Promise<ContractEntity | null> {
    const contract = await prisma.contract.findFirst({
      where: { id, tenantId }
    });

    return contract ? ContractMapper.toDomain(contract) : null;
  }

  // ✅ Implementando o método que faltava
  async findAll(tenantId: string): Promise<ContractEntity[]> {
    const contracts = await prisma.contract.findMany({
      where: { tenantId }
    });

    return contracts.map(contract => ContractMapper.toDomain(contract));
  }

  // ✅ Implementando busca detalhada para o Frontend
  async findByIdWithDetails(id: string, tenantId: string): Promise<any | null> {
    const contract = await prisma.contract.findFirst({
      where: { id, tenantId },
      include: {
        renter: true,
        property: true,
        template: {
            select: { name: true }
        }
      }
    });

    return contract;
  }

  async save(contract: ContractEntity): Promise<void> {
    const data = ContractMapper.toPersistence(contract);
    
    await prisma.contract.update({
      where: { id: contract.id },
      data
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