import { prisma } from "../../../../config/database.config.js";
import { IPaymentRepository, CreatePaymentData, PaginationQuery } from "../../domain/repositories/payment.repository.interface.js";
import { Payment, PaymentStatus } from "../../domain/entities/payment.entity.js";

export class PrismaPaymentRepository implements IPaymentRepository {
  async create(data: CreatePaymentData): Promise<Payment> {
    const result = await prisma.payment.create({ data });
    return result as unknown as Payment;
  }

  async findAll(tenantId: string, query?: PaginationQuery): Promise<Payment[]> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const results = await prisma.payment.findMany({
      where: { tenantId },
      include: {
        contract: { select: { landlordName: true, propertyAddress: true } },
      },
      orderBy: { paymentDate: "desc" },
      skip,
      take: limit,
    });

    return results as unknown as Payment[];
  }

  async findById(id: string, tenantId: string): Promise<Payment | null> {
    const result = await prisma.payment.findFirst({
      where: { id, tenantId },
      include: {
        contract: { select: { landlordName: true, propertyAddress: true } },
      },
    });

    return result as unknown as Payment | null;
  }

  async updateStatus(id: string, tenantId: string, status: PaymentStatus): Promise<Payment> {
    const existing = await prisma.payment.findFirst({ where: { id, tenantId } });

    if (!existing) throw new Error("Pagamento não encontrado");

    const updated = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    return updated as unknown as Payment;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    const existing = await prisma.payment.findFirst({ where: { id, tenantId } });

    if (!existing) throw new Error("Pagamento não encontrado");

    await prisma.payment.delete({ where: { id } });
  }
}