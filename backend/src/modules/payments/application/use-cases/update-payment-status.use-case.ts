import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface.js";
import { Payment, PaymentStatus } from "../../domain/entities/payment.entity.js";

export class UpdatePaymentStatusUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(id: string, tenantId: string, status: PaymentStatus): Promise<Payment> {
    return this.repo.updateStatus(id, tenantId, status);
  }
}