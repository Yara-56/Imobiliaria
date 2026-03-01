import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface.js";
import {
  Payment,
  PaymentStatus,
  PAYMENT_STATUS,
  isValidPaymentStatus,
} from "../../domain/entities/payment.entity.js";
import { AppError } from "../../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";
import { ReceiptGeneratorService } from "../../services/receiptGenerator.js";

export class UpdatePaymentStatusUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(
    id: string,
    tenantId: string,
    status: PaymentStatus
  ): Promise<Payment> {
    // ─────────────────────────────────────────────
    // 1️⃣ validar status (runtime safe)
    // ─────────────────────────────────────────────
    if (!isValidPaymentStatus(status)) {
      throw new AppError({
        message: "Status de pagamento inválido.",
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR,
      });
    }

    // ─────────────────────────────────────────────
    // 2️⃣ buscar pagamento atual
    // ─────────────────────────────────────────────
    const existingPayment = await this.repo.findById(id, tenantId);

    if (!existingPayment) {
      throw new AppError({
        message: "Pagamento não encontrado.",
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
      });
    }

    // ─────────────────────────────────────────────
    // 3️⃣ evitar atualização desnecessária
    // ─────────────────────────────────────────────
    if (existingPayment.status === status) {
      return existingPayment;
    }

    // ─────────────────────────────────────────────
    // 4️⃣ atualizar status
    // ─────────────────────────────────────────────
    const updatedPayment = await this.repo.updateStatus(
      id,
      tenantId,
      status
    );

    // ─────────────────────────────────────────────
    // 5️⃣ registrar histórico (opcional)
    // ─────────────────────────────────────────────
    try {
      await this.repo.createHistory?.({
        paymentId: updatedPayment.id,
        previousStatus: existingPayment.status,
        newStatus: status,
        changedAt: new Date(),
      });
    } catch (err) {
      console.warn("⚠️ Histórico não registrado:", err);
    }

    // a─────────────────────────────────────────────
    // 🚀 6️⃣ REGRA DE NEGÓCIO PRINCIPAL
    // gerar recibo automaticamente quando pago
    // ─────────────────────────────────────────────
    if (status === PAYMENT_STATUS.PAGO) {
      try {
        await ReceiptGeneratorService.generate({
          paymentId: updatedPayment.id,
        });
      } catch (err) {
        console.error("❌ Erro ao gerar recibo:", err);
        // não quebra o fluxo principal
      }
    }

    return updatedPayment;
  }
}