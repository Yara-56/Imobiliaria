import { Request, Response, NextFunction } from "express";
// 💡 Se o erro TS2305 persistir, certifique-se que o enum existe no schema.prisma
import { PaymentStatus } from "@prisma/client";

import { AppError } from "../../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

import { PrismaPaymentRepository } from "../../infrastructure/repositories/prismapayment.repository.js";

import { ListPaymentsUseCase } from "../../application/use-cases/list-payments.use-case.js";
import { CreatePaymentUseCase } from "../../application/use-cases/create-payment.use-case.js";
import { GetPaymentByIdUseCase } from "../../application/use-cases/get-payment-by-id.use-case.js";
import { UpdatePaymentStatusUseCase } from "../../application/use-cases/update-payment-status.use-case.js";
import { DeletePaymentUseCase } from "../../application/use-cases/delete-payment.use-case.js";
import { GenerateContractPaymentsUseCase } from "../../application/use-cases/generate-contract-payments.use-case.js";

const repo = new PrismaPaymentRepository();

export class PaymentController {
  constructor() {
    // Faz o bind de todos os métodos para evitar erros de 'this' nas rotas
    this.generateAuto = this.generateAuto.bind(this);
    this.listPayments = this.listPayments.bind(this);
    this.updatePaymentStatus = this.updatePaymentStatus.bind(this);
    this.getPaymentById = this.getPaymentById.bind(this);
    this.deletePayment = this.deletePayment.bind(this);
    this.createPayment = this.createPayment.bind(this);
  }

  /**
   * ✅ CRIAÇÃO MANUAL (O que a rota estava procurando)
   */
  async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new CreatePaymentUseCase(repo);
      const payment = await useCase.execute({
        ...req.body,
        tenantId: req.user.tenantId,
        userId: req.user.id
      });

      res.status(HttpStatus.CREATED).json({ status: "success", data: { payment } });
    } catch (error) {
      next(error);
    }
  }

  async generateAuto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { contractId } = req.params;
      const { tenantId, id: userId } = req.user;

      const useCase = new GenerateContractPaymentsUseCase();
      const result = await useCase.execute(contractId, tenantId, userId);

      res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "Projeção financeira gerada com sucesso.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async listPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new ListPaymentsUseCase(repo);
      const payments = await useCase.execute(req.user.tenantId, req.query);

      res.status(HttpStatus.OK).json({
        status: "success",
        results: payments?.length || 0,
        data: { payments },
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, paymentDate } = req.body;

      const useCase = new UpdatePaymentStatusUseCase(repo);
      
      const updatedPayment = await useCase.execute(id, req.user.tenantId, {
        status: status as PaymentStatus, 
        paymentDate: paymentDate ? new Date(paymentDate) : new Date()
      });

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { payment: updatedPayment },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetPaymentByIdUseCase(repo);
      const payment = await useCase.execute(req.params.id, req.user.tenantId);

      if (!payment) {
        throw new AppError({
          message: "Pagamento não encontrado.",
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      res.status(HttpStatus.OK).json({ status: "success", data: { payment } });
    } catch (error) {
      next(error);
    }
  }

  async deletePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new DeletePaymentUseCase(repo);
      await useCase.execute(req.params.id, req.user.tenantId);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();