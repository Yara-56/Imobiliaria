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
import { PaymentReceiptService } from "../payment-receipt.service.js";

// ✅ Definindo uma interface para os dados de atualização
interface UpdateStatusData {
  status: PaymentStatus;
  paymentDate?: Date;
}

export class UpdatePaymentStatusUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(
    id: string,
    tenantId: string,
    data: UpdateStatusData // ✅ Agora aceita o objeto completo
  ): Promise<Payment> {
    const { status, paymentDate } = data;

    // 1️⃣ Validar status
    if (!isValidPaymentStatus(status)) {
      throw new AppError({
        message: "Status de pagamento inválido.",
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR,
      });
    }

    // 2️⃣ Buscar pagamento existente
    const existingPayment = await this.repo.findById(id, tenantId);

    if (!existingPayment) {
      throw new AppError({
        message: "Pagamento não encontrado.",
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
      });
    }

    // 3️⃣ Atualizar no Repositório (Passando o objeto com a data)
    // ✅ O seu repository.updateStatus deve estar preparado para receber a data também
    const updatedPayment = await this.repo.updateStatus(
      id,
      tenantId,
      status,
      paymentDate
    );

    // 4️⃣ Registrar histórico
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

    // 🚀 5️⃣ Gerar recibo automaticamente ao marcar como PAGO
    if (status === PAYMENT_STATUS.PAGO) {
      try {
        await PaymentReceiptService.generateReceipt(updatedPayment.id);
        console.log(`✅ Recibo gerado para o pagamento: ${updatedPayment.id}`);
      } catch (err) {
        console.error("❌ Erro ao gerar recibo:", err);
      }
    }

    return updatedPayment;
  }
}