import { prisma } from "@shared/infra/database/prisma.client.js";
import type { Payment, PaymentStatus, PaymentMethod } from "@prisma/client";

/**
 * Tipagem para criação de pagamento (compatível com seu schema)
 */
export interface CreatePaymentDTO {
  amount: number;
  referenceMonth: string;
  dueDate: Date;
  method: PaymentMethod;
  status?: PaymentStatus;

  contractId: string;
  renterId: string;
  tenantId: string;
  userId: string;
}

/**
 * PaymentRepository
 * Repositório especializado em operações de Pagamentos
 */
export class PaymentRepository {
  /**
   * Criar pagamento
   */
  async create(data: CreatePaymentDTO): Promise<Payment> {
    return prisma.payment.create({
      data: {
        amount: data.amount,
        referenceMonth: data.referenceMonth,
        dueDate: data.dueDate,
        method: data.method,
        status: data.status ?? "PENDING",
        contractId: data.contractId,
        renterId: data.renterId,
        tenantId: data.tenantId,
        userId: data.userId,
      },
    });
  }

  /**
   * Listar pagamentos do tenant
   */
  async list(tenantId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { tenantId },
      orderBy: { dueDate: "desc" },
    });
  }

  /**
   * Buscar pagamento por ID
   */
  async findById(id: string, tenantId: string): Promise<Payment | null> {
    return prisma.payment.findFirst({
      where: { id, tenantId },
      include: {
        renter: true,
        contract: true,
        tenant: true,
        user: true,
        documents: true,
      },
    });
  }

  /**
   * Atualizar status (PAGO, PENDENTE, etc.)
   */
  async updateStatus(
    id: string,
    tenantId: string,
    status: PaymentStatus
  ): Promise<void> {
    await prisma.payment.updateMany({
      where: { id, tenantId },
      data: { status },
    });
  }

  /**
   * Excluir pagamento
   */
  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.payment.deleteMany({
      where: { id, tenantId },
    });
  }
}