import { injectable } from "tsyringe";
import { prisma } from "../../../config/database.config";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatus } from "../../../shared/errors/http-status";
import { ContractStatus } from "@prisma/client";

interface ICreateContractDTO {
  propertyId: string;
  rentAmount: number;
  startDate: Date;
  endDate?: Date;
  tenantId: string;
  userId: string;
  dueDay?: number; // Dia de vencimento (Ex: todo dia 10)
}

@injectable()
export class ContractService {
  /**
   * 🏗️ Gera o registro do contrato no Banco de Dados
   */
  async execute(data: ICreateContractDTO) {
    try {
      // 1. Gerar um número de contrato único (Ex: CNT-2026-0001)
      const year = new Date().getFullYear();
      const count = await prisma.contract.count({
        where: { tenantId: data.tenantId }
      });
      const contractNumber = `CNT-${year}-${(count + 1).toString().padStart(4, '0')}`;

      // 2. Criar o Contrato no MongoDB
      const contract = await prisma.contract.create({
        data: {
          contractNumber,
          rentAmount: data.rentAmount,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          dueDay: data.dueDay || 5, // Padrão dia 5 se não informado
          status: ContractStatus.ACTIVE, // Já nasce ativo no fluxo simplificado
          
          // Relacionamentos (IDs do MongoDB)
          tenantId: data.tenantId,   // Imobiliária
          propertyId: data.propertyId, // Imóvel
          renterId: data.tenantId,     // Aqui usamos o ID do locatário (Renter)
          userId: data.userId,         // Usuário que criou
        },
        include: {
          property: true,
          renter: true
        }
      });

      // 3. Opcional: Atualizar o status do imóvel para ALUGADO
      await prisma.property.update({
        where: { id: data.propertyId },
        data: { status: 'RENTED' }
      });

      return contract;

    } catch (error: any) {
      console.error("❌ Erro ao gerar contrato no banco:", error);
      throw new AppError({
        message: "Erro ao persistir contrato no banco de dados.",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}