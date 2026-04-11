import type { PaymentMethod as PrismaPaymentMethod } from "@prisma/client";
import { prisma } from "@config/database.config.js";

import {
  IPaymentRepository,
  CreatePaymentData,
  CreatePaymentHistoryData,
  PaginationQuery,
} from "../../domain/repositories/payment.repository.interface.js";

import type { Payment, PaymentStatus } from "../../domain/entities/payment.entity.js";

function mapDomainMethodToPrisma(
  method: CreatePaymentData["method"]
): PrismaPaymentMethod {
  if (method === "RECURRING_CARD") return "CREDIT_CARD";
  return method as PrismaPaymentMethod;
}

export class PrismaPaymentRepository implements IPaymentRepository {
  async create(data: CreatePaymentData): Promise<Payment> {
    const contract = await prisma.contract.findFirst({
      where: { id: data.contractId, tenantId: data.tenantId },
    });

    if (!contract) {
      throw new Error("Contrato não encontrado para o pagamento.");
    }

    const result = await prisma.payment.create({
      data: {
        amount: data.amount,
        referenceMonth: data.referenceMonth,
        dueDate: data.dueDate,
        method: mapDomainMethodToPrisma(data.method),
        contractId: data.contractId,
        renterId: contract.renterId,
        tenantId: data.tenantId,
        userId: data.userId,
        paymentDate: data.paymentDate ?? null,
        status: (data.status as import("@prisma/client").PaymentStatus) ?? "PENDING",
      },
    });

    return result as unknown as Payment;
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
                address: true,
              },
            },
            renter: {
              select: {
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { dueDate: "desc" },
      skip,
      take: limit,
    });

    return results as unknown as Payment[];
  }

  async findById(id: string, tenantId: string): Promise<Payment | null> {
    const result = await prisma.payment.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        contract: {
          include: {
            property: {
              select: {
                address: true,
                title: true,
              },
            },
            renter: {
              select: {
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return result as unknown as Payment | null;
  }

  async updateStatus(
    id: string,
    tenantId: string,
    status: PaymentStatus
  ): Promise<Payment> {
    await prisma.payment.updateMany({
      where: { id, tenantId },
      data: { status: status as import("@prisma/client").PaymentStatus },
    });

    const updated = await prisma.payment.findFirst({
      where: { id, tenantId },
    });

    if (!updated) {
      throw new Error("Pagamento não encontrado após atualização.");
    }

    return updated as unknown as Payment;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.payment.deleteMany({
      where: { id, tenantId },
    });
  }

  async createHistory(data: CreatePaymentHistoryData): Promise<void> {
    console.log("🧾 Registro de Histórico:", data);
  }
}
