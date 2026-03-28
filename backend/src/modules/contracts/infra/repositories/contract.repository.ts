import { prisma } from "@/config/database.config";
import { logger } from "@/shared/utils/logger";
import { AppError } from "@/shared/errors/AppError";
import { IContract, IContractInput } from "@modules/contracts/domain/contract.types";

/**
 * Repositório de Contratos
 * A camada que fala diretamente com o Prisma (database)
 */
export class ContractRepository {
  /**
   * 🔵 Lista todos contratos do tenant
   */
  async findAll(tenantId: string): Promise<IContract[]> {
    try {
      const contracts = await prisma.contract.findMany({
        where: { tenantId },
        include: {
          renter: true,
          property: true,
          payments: true
        },
        orderBy: { createdAt: "desc" }
      });

      return contracts;
    } catch (error) {
      logger.error({
        msg: "Erro ao listar contratos",
        tenantId,
        error
      });
      throw new AppError("Erro ao buscar contratos.", 500);
    }
  }

  /**
   * 🟩 Cria contrato
   */
  async create(data: IContractInput & { tenantId: string; userId: string; status: string; contractNumber: string; }): Promise<IContract> {
    try {
      const contract = await prisma.contract.create({
        data: {
          contractNumber: data.contractNumber,
          tenantId: data.tenantId,
          userId: data.userId,

          propertyId: data.propertyId,
          renterId: data.renterId,

          rentAmount: Number(data.rentAmount),
          dueDay: Number(data.dueDay),

          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,

          depositValue: data.depositValue ? Number(data.depositValue) : null,

          paymentMethod: data.paymentMethod,
          status: data.status,
          notes: data.notes ?? null
        },
        include: {
          renter: true,
          property: true
        }
      });

      logger.info({
        msg: "Contrato criado no banco",
        id: contract.id,
        tenantId: data.tenantId
      });

      return contract;
    } catch (error) {
      logger.error({
        msg: "Erro ao criar contrato",
        data,
        error
      });
      throw new AppError("Erro ao criar contrato.", 500);
    }
  }

  /**
   * 🟧 Busca contrato por ID + tenant
   */
  async findById(contractId: string, tenantId: string): Promise<IContract | null> {
    try {
      const contract = await prisma.contract.findFirst({
        where: { id: contractId, tenantId },
        include: {
          renter: true,
          property: true,
          payments: true
        }
      });

      return contract;
    } catch (error) {
      logger.error({
        msg: "Erro ao buscar contrato por ID",
        contractId,
        tenantId,
        error
      });
      throw new AppError("Erro ao buscar contrato.", 500);
    }
  }

  /**
   * 🟨 Atualiza contrato
   */
  async update(
    contractId: string,
    tenantId: string | undefined,
    data: Partial<IContractInput> & { status?: string; signedUrl?: string }
  ): Promise<IContract | null> {
    try {
      const contract = await prisma.contract.updateMany({
        where: tenantId
          ? { id: contractId, tenantId }
          : { id: contractId }, // usado no webhook (tenant pode ser desconhecido)
        data: {
          ...("status" in data ? { status: data.status } : {}),
          ...("signedUrl" in data ? { signedUrl: data.signedUrl } : {}),

          ...(data.rentAmount ? { rentAmount: Number(data.rentAmount) } : {}),
          ...(data.dueDay ? { dueDay: Number(data.dueDay) } : {}),
          ...(data.depositValue ? { depositValue: Number(data.depositValue) } : {}),

          ...(data.startDate ? { startDate: new Date(data.startDate) } : {}),
          ...(data.endDate ? { endDate: new Date(data.endDate) } : {}),

          ...(data.notes ? { notes: data.notes } : {}),
          ...(data.paymentMethod ? { paymentMethod: data.paymentMethod } : {})
        }
      });

      // Se não atualizou nada, não existe
      if (contract.count === 0) {
        return null;
      }

      // Retorna contrato atualizado
      const updated = await prisma.contract.findUnique({
        where: { id: contractId },
        include: {
          renter: true,
          property: true,
          payments: true
        }
      });

      return updated;
    } catch (error) {
      logger.error({
        msg: "Erro ao atualizar contrato",
        contractId,
        data,
        error
      });
      throw new AppError("Erro ao atualizar contrato.", 500);
    }
  }

  /**
   * 🟥 Remove contrato
   */
  async delete(contractId: string, tenantId: string): Promise<boolean> {
    try {
      const deleted = await prisma.contract.deleteMany({
        where: { id: contractId, tenantId }
      });

      return deleted.count > 0;
    } catch (error) {
      logger.error({
        msg: "Erro ao remover contrato",
        contractId,
        tenantId,
        error
      });
      throw new AppError("Erro ao remover contrato.", 500);
    }
  }
}