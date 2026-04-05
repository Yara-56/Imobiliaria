import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface.js";
import { Payment } from "../../domain/entities/payment.entity.js";

export class GetPaymentByIdUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(id: string, tenantId: string): Promise<Payment | null> {
    return this.repo.findById(id, tenantId);
  }
}