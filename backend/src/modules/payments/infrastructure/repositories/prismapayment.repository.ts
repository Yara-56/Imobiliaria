// ✅ Mudamos o import de '@/shared/...' para o caminho relativo correto
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
  PAYMENT_STATUS, // Adicionado para garantir o default no create
} from "../../domain/entities/payment.entity.js";

export class PrismaPaymentRepository implements IPaymentRepository {
  // ✅ CREATE
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

  // ✅ LIST (Com relações para evitar UI vazia)
  async findAll(tenantId: string, query?: PaginationQuery): Promise<Payment[]> {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;

    const results = await prisma.payment.findMany({
      where: { tenantId },
      include: {
        contract: {
          include: {
            property: { select: { address: true } },
            renter: { select: { name: true } },
          },
        },
      },
      orderBy: { dueDate: "desc" },
      skip,
      take: limit,
    });

    return results as Payment[];
  }

  // ✅ GET BY ID
  async findById(id: string, tenantId: string): Promise<Payment | null> {
    const result = await prisma.payment.findFirst({
      where: { id, tenantId },
    });

    return result as Payment | null;
  }

  // ✅ UPDATE STATUS (SaaS Safe: ID + TenantID no WHERE)
  async updateStatus(
    id: string, 
    tenantId: string, 
    status: PaymentStatus
  ): Promise<Payment> {
    const updated = await prisma.payment.update({
      where: { 
        id,
        tenantId // Segurança: impede que um tenant altere dados de outro
      },
      data: { status },
    });

    return updated as Payment;
  }

  // ✅ DELETE (SaaS Safe)
  async delete(id: string, tenantId: string): Promise<void> {
    await prisma.payment.delete({
      where: { 
        id,
        tenantId 
      },
    });
  }

  // ✅ HISTÓRICO
  async createHistory(data: CreatePaymentHistoryData): Promise<void> {
    console.log("🧾 Registro de Histórico:", data);
  }
}