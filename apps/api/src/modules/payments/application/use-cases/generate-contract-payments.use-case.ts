import { prisma } from "@shared/infra/database/prisma.client.js";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";

export class GenerateContractPaymentsUseCase {
  /**
   * Gera todas as parcelas de um contrato automaticamente
   */
  async execute(contractId: string, tenantId: string, userId: string) {
    // 1. Busca os dados do contrato
    const contract = await prisma.contract.findFirst({
      where: { id: contractId, tenantId },
      include: { renter: true }
    });

    if (!contract) {
      throw new AppError("Contrato não encontrado.", HttpStatus.NOT_FOUND);
    }

    if (!contract.endDate) {
      throw new AppError("Para gerar parcelas automáticas, o contrato precisa de uma data de término.", HttpStatus.BAD_REQUEST);
    }

    const payments = [];
    let currentDate = new Date(contract.startDate);
    const endDate = new Date(contract.endDate);

    // 2. Loop para criar as parcelas mês a mês
    while (currentDate <= endDate) {
      const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      
      // Define a data de vencimento baseada no 'dueDay' do contrato
      const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), contract.dueDay);

      payments.push({
        amount: contract.rentAmount,
        referenceMonth: monthName.toUpperCase(),
        dueDate,
        method: PaymentMethod.PIX,
        status: "PENDING" as PaymentStatus,
        contractId: contract.id,
        renterId: contract.renterId,
        tenantId,
        userId,
      });

      // Avança para o próximo mês
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // 3. Salva tudo de uma vez no MongoDB (Transaction ou createMany)
    // No MongoDB com Prisma usamos createMany
    const result = await prisma.payment.createMany({
      data: payments
    });

    return {
      count: result.count,
      message: `${result.count} parcelas geradas com sucesso para o período selecionado.`
    };
  }
}