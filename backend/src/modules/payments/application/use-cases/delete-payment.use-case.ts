import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface.js";

export class DeletePaymentUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(id: string, tenantId: string): Promise<void> {
    return this.repo.delete(id, tenantId);
  }
}