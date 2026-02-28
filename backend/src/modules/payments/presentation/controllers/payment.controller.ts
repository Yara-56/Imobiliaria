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

export const listPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const useCase = new ListPaymentsUseCase(repo);
    const payments = await useCase.execute(req.user.tenantId, req.query);
    res.status(HttpStatus.OK).json({ status: "success", results: payments.length, data: { payments } });
  } catch (error) {
    next(new AppError({ message: "Erro ao carregar pagamentos.", statusCode: HttpStatus.INTERNAL_SERVER_ERROR, errorCode: ErrorCodes.INTERNAL_ERROR }));
  }
};

export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const useCase = new CreatePaymentUseCase(repo);
    const payment = await useCase.execute({
      ...req.body,
      paymentDate: req.body.paymentDate ? new Date(req.body.paymentDate) : new Date(),
      tenantId: req.user.tenantId,
      userId: req.user.id,
    });
    res.status(HttpStatus.CREATED).json({ status: "success", data: { payment } });
  } catch (error: any) {
    next(new AppError({ message: "Erro ao registrar pagamento.", statusCode: HttpStatus.BAD_REQUEST, errorCode: ErrorCodes.VALIDATION_ERROR }));
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const useCase = new GetPaymentByIdUseCase(repo);
    const payment = await useCase.execute(req.params.id, req.user.tenantId);
    if (!payment) {
      return next(new AppError({ message: "Pagamento não encontrado.", statusCode: HttpStatus.NOT_FOUND, errorCode: ErrorCodes.RESOURCE_NOT_FOUND }));
    }
    res.status(HttpStatus.OK).json({ status: "success", data: { payment } });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const useCase = new UpdatePaymentStatusUseCase(repo);
    const payment = await useCase.execute(req.params.id, req.user.tenantId, req.body.status);
    res.status(HttpStatus.OK).json({ status: "success", data: { payment } });
  } catch (error) {
    next(new AppError({ message: "Erro ao atualizar status.", statusCode: HttpStatus.BAD_REQUEST }));
  }
};

export const deletePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const useCase = new DeletePaymentUseCase(repo);
    await useCase.execute(req.params.id, req.user.tenantId);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(new AppError({ message: "Pagamento não encontrado.", statusCode: HttpStatus.NOT_FOUND }));
  }
};