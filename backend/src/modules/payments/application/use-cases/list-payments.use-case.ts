import { IPaymentRepository, PaginationQuery } from "../../domain/repositories/payment.repository.interface.js";
import { Payment } from "../../domain/entities/payment.entity.js";

export class ListPaymentsUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(tenantId: string, query?: PaginationQuery): Promise<Payment[]> {
    return this.repo.findAll(tenantId, query);
  }
}