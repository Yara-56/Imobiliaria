import { Request, Response, NextFunction } from "express";

import { AppError } from "../../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

import { PrismaPaymentRepository } from "../../infrastructure/repositories/prismapayment.repository.js";

import { ListPaymentsUseCase } from "../../application/use-cases/list-payments.use-case.js";
import { CreatePaymentUseCase } from "../../application/use-cases/create-payment.use-case.js";
import { GetPaymentByIdUseCase } from "../../application/use-cases/get-payment-by-id.use-case.js";
import { UpdatePaymentStatusUseCase } from "../../application/use-cases/update-payment-status.use-case.js";
import { DeletePaymentUseCase } from "../../application/use-cases/delete-payment.use-case.js";

const repo = new PrismaPaymentRepository();

/**
 * CONTROLADOR OFICIAL DE PAGAMENTOS - HOMEFLUX PRO 2026
 *
 * Multi-tenant real
 * Clean Architecture
 * Totalmente desacoplado do Express
 * Casos de uso isolados
 * Pronto para logs, auditoria e PDF receipt
 */
export class PaymentController {


  /**
   * LISTAR PAGAMENTOS
   * GET /v1/payments
   */
  async listPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user.tenantId;

      const useCase = new ListPaymentsUseCase(repo);
      const payments = await useCase.execute(tenantId, req.query);

      res.status(HttpStatus.OK).json({
        status: "success",
        results: payments.length,
        data: { payments },
      });

    } catch (error) {
      next(
        new AppError({
          message: "Erro ao carregar pagamentos.",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: ErrorCodes.INTERNAL_ERROR,
        })
      );
    }
  }



  /**
   * CRIAR PAGAMENTO
   * POST /v1/payments
   */
  async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user.tenantId;
      const userId = req.user.id;

      const useCase = new CreatePaymentUseCase(repo);

      const payload = {
        ...req.body,
        paymentDate: req.body.paymentDate ? new Date(req.body.paymentDate) : new Date(),
        tenantId,
        userId,
      };

      const payment = await useCase.execute(payload);

      res.status(HttpStatus.CREATED).json({
        status: "success",
        data: { payment },
      });

    } catch (error: any) {
      next(
        new AppError({
          message: "Erro ao registrar pagamento.",
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: ErrorCodes.VALIDATION_ERROR,
        })
      );
    }
  }



  /**
   * BUSCAR PAGAMENTO POR ID
   * GET /v1/payments/:id
   */
  async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user.tenantId;
      const paymentId = req.params.id;

      const useCase = new GetPaymentByIdUseCase(repo);
      const payment = await useCase.execute(paymentId, tenantId);

      if (!payment) {
        return next(
          new AppError({
            message: "Pagamento não encontrado.",
            statusCode: HttpStatus.NOT_FOUND,
            errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
          })
        );
      }

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { payment },
      });

    } catch (error) {
      next(error);
    }
  }



  /**
   * ATUALIZAR STATUS DO PAGAMENTO
   * PATCH /v1/payments/:id
   */
  async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user.tenantId;
      const paymentId = req.params.id;
      const { status } = req.body;

      const useCase = new UpdatePaymentStatusUseCase(repo);
      const updatedPayment = await useCase.execute(paymentId, tenantId, status);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { payment: updatedPayment },
      });

    } catch (error) {
      next(
        new AppError({
          message: "Erro ao atualizar status.",
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: ErrorCodes.VALIDATION_ERROR,
        })
      );
    }
  }



  /**
   * DELETAR PAGAMENTO
   * DELETE /v1/payments/:id
   */
  async deletePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user.tenantId;
      const paymentId = req.params.id;

      const useCase = new DeletePaymentUseCase(repo);
      await useCase.execute(paymentId, tenantId);

      res.status(HttpStatus.NO_CONTENT).send();

    } catch (error) {
      next(
        new AppError({
          message: "Pagamento não encontrado.",
          statusCode: HttpStatus.NOT_FOUND,
          errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
        })
      );
    }
  }
}

export const paymentController = new PaymentController();