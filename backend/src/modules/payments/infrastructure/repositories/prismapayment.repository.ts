import { prisma } from "../../../../config/database.config.js";

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
                id: true,
                name: true,
                street: true,
                number: true,
                neighborhood: true,
                city: true,
                state: true,
                zipCode: true,
              },
            },
            renter: {
              select: {
                id: true,
                fullName: true,
              },
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

  async findById(id: string, tenantId: string): Promise<Payment | null> {
    const result = await prisma.payment.findFirst({
      where: { id, tenantId },
    });

    return result as Payment | null;
  }

  async updateStatus(
    id: string,
    tenantId: string,
    status: PaymentStatus
  ): Promise<Payment> {
    const updated = await prisma.payment.update({
      where: {
        id,
        tenantId,
      },
      data: { status },
    });

    return updated as Payment;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.payment.delete({
      where: {
        id,
        tenantId,
      },
    });
  }

  async createHistory(data: CreatePaymentHistoryData): Promise<void> {
    console.log("🧾 Registro de Histórico:", data);
  }
}