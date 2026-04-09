// backend/src/modules/payments/infrastructure/repositories/prismapayment.repository.ts

import { prisma } from "@config/database.config.js"; 

import {
  IPaymentRepository,
  CreatePaymentData,
  CreatePaymentHistoryData,
  PaginationQuery,
} from "../../domain/repositories/payment.repository.interface.js";

import {
  Payment,
  PaymentStatus,
  PAYMENT_STATUS,
} from "../../domain/entities/payment.entity.js";

export class PrismaPaymentRepository implements IPaymentRepository {
  /**
   * ✅ CREATE - Criar novo pagamento
   */
  async create(data: CreatePaymentData): Promise<Payment> {
    const result = await prisma.payment.create({
      data: {
        amount: data.amount,
        referenceMonth: data.referenceMonth,
        dueDate: data.dueDate,
        method: data.method,
        contractId: data.contractId,
        tenantId: data.tenantId,
        userId: data.userId,
        paymentDate: data.paymentDate,
        status: data.status ?? PAYMENT_STATUS.PENDENTE,
        receiptUrl: data.receiptUrl,
        notes: data.notes,
      },
    });

    return result as Payment;
  }

  /**
   * ✅ LIST - Listar pagamentos com relações
   */
  async findAll(tenantId: string, query?: PaginationQuery): Promise<Payment[]> {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;

    const results = await prisma.payment.findMany({
      where: { tenantId },
      include: {
        contract: {
          include: {
            property: { 
              select: { 
                address: true 
              } 
            },
            renter: { 
              select: { 
                fullName: true,  // ✅ CORRIGIDO: name → fullName
                email: true,
                phone: true,
              } 
            },
          },
        },
      },
      orderBy: { dueDate: "desc" },
      skip,
      take: limit,
    });

    return results as Payment[];
  }

  /**
   * ✅ GET BY ID - Buscar pagamento por ID
   */
  async findById(id: string, tenantId: string): Promise<Payment | null> {
    const result = await prisma.payment.findFirst({
      where: { 
        id, 
        tenantId 
      },
      include: {
        contract: {
          include: {
            property: { 
              select: { 
                address: true,
                title: true,
              } 
            },
            renter: { 
              select: { 
                fullName: true,  // ✅ CORRIGIDO
                email: true,
                phone: true,
              } 
            },
          },
        },
      },
    });

    return result as Payment | null;
  }

  /**
   * ✅ UPDATE STATUS - Atualizar status do pagamento (SaaS Safe)
   */
  async updateStatus(
    id: string, 
    tenantId: string, 
    status: PaymentStatus
  ): Promise<Payment> {
    const updated = await prisma.payment.update({
      where: { 
        id,
        tenantId, // ✅ Segurança: impede que um tenant altere dados de outro
      },
      data: { status },
    });

    return updated as Payment;
  }

  /**
   * ✅ DELETE - Deletar pagamento (SaaS Safe)
   */
  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.payment.delete({
      where: { 
        id,
        tenantId,
      },
    });
  }

  /**
   * ✅ HISTÓRICO - Criar registro de histórico
   */
  async createHistory(data: CreatePaymentHistoryData): Promise<void> {
    // TODO: Implementar tabela de histórico no Prisma
    console.log("🧾 Registro de Histórico:", data);
  }
}