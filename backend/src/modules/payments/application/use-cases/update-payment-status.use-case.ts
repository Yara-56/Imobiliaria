import { inject, injectable } from "tsyringe"; // 🔥 Adicionado para DI
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import {
  Payment,
  PaymentStatus,
  PAYMENT_STATUS,
  isValidPaymentStatus,
} from "../../domain/entities/payment.entity";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/errors/http-status";
import { ErrorCodes } from "../../../../shared/errors/error-codes";
import { PaymentReceiptService } from "../../services/PaymentReceiptService";

interface UpdateStatusData {
  status: PaymentStatus;
  paymentDate?: Date;
}

@injectable() // ✅ Essencial para o tsyringe
export class UpdatePaymentStatusUseCase {
  constructor(
    @inject("PaymentRepository") // ✅ Ajuste o nome do token conforme seu container
    private readonly repo: IPaymentRepository,

    @inject(PaymentReceiptService) // ✅ Injetando o serviço de recibos
    private readonly receiptService: PaymentReceiptService
  ) {}

  async execute(
    id: string,
    tenantId: string,
    data: UpdateStatusData
  ): Promise<Payment> {
    const { status, paymentDate } = data;

    // 1. Validar status
    if (!isValidPaymentStatus(status)) {
      throw new AppError({
        message: "Status de pagamento inválido.",
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR,
      });
    }

    // 2. Buscar pagamento existente
    const existingPayment = await this.repo.findById(id, tenantId);

    if (!existingPayment) {
      throw new AppError({
        message: "Pagamento não encontrado.",
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
      });
    }

    // 3. Atualizar no Repositório
    const updatedPayment = await this.repo.updateStatus(
      id,
      tenantId,
      status,
      paymentDate
    );

    // 4. Registrar histórico
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

    // 🚀 5. Fluxo de Automação: Gerar recibo ao marcar como PAGO
    // Verifique se no seu enum do banco é 'PAGO' ou 'PAID' (no seu schema era PAID)
    if (status === PAYMENT_STATUS.PAID || status === (PAYMENT_STATUS as any).PAGO) {
      try {
        // ✅ Agora usamos a instância injetada e o método .execute()
        await this.receiptService.execute(updatedPayment.id);
        console.log(`✅ Recibo gerado com sucesso: ${updatedPayment.id}`);
      } catch (err) {
        // Não travamos o fluxo principal se o PDF falhar, apenas logamos
        console.error("❌ Erro ao gerar recibo automático:", err);
      }
    }

    return updatedPayment;
  }
}