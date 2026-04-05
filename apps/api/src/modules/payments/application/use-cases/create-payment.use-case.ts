import { IPaymentRepository, CreatePaymentData } from "../../domain/repositories/payment.repository.interface.js";
import { Payment } from "../../domain/entities/payment.entity.js";

export class CreatePaymentUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(data: CreatePaymentData): Promise<Payment> {
    return this.repo.create(data);
  }
}