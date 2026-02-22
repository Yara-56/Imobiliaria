// CAMINHO: backend/src/modules/payments/controllers/payment.controller.ts
import { Request, Response, NextFunction } from "express";
import { Payment } from "../models/payment.model.js"; 
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";
import { ErrorCodes } from "../../../shared/errors/error-codes.js";

/**
 * 📊 LISTAR PAGAMENTOS (Multi-tenancy)
 */
export const listPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 🛡️ Cybersecurity: Filtro por tenantId para isolamento total.
    const tenantId = req.user?.tenantId;
    
    const payments = await Payment.find({ tenantId })
      .populate("contractId", "landlordName propertyAddress")
      .sort("-paymentDate")
      .lean(); 

    res.status(HttpStatus.OK).json({
      status: "success",
      results: payments.length,
      data: { payments },
    });
  } catch (error: any) {
    next(new AppError({ 
      message: "Erro ao carregar pagamentos.", 
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: ErrorCodes.INTERNAL_ERROR 
    }));
  }
};

/**
 * 💸 CRIAR PAGAMENTO
 */
export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user?.tenantId;

    // ✅ CORREÇÃO TS(2339): Mudança de .id para ._id conforme express.d.ts
    const ownerId = req.user?._id;

    const payment = await Payment.create({
      ...req.body,
      tenantId, 
      owner: ownerId, 
    });

    res.status(HttpStatus.CREATED).json({ 
      status: "success", 
      data: { payment } 
    });
  } catch (error: any) {
    next(new AppError({ 
      message: "Erro ao registrar pagamento.", 
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: ErrorCodes.VALIDATION_ERROR 
    }));
  }
};

/**
 * 🔍 BUSCAR POR ID
 */
export const getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    }).lean();

    if (!payment) {
      return next(new AppError({ 
        message: "Pagamento não encontrado ou acesso negado.", 
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND 
      }));
    }
    
    res.status(HttpStatus.OK).json({ status: "success", data: { payment } });
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ ATUALIZAR STATUS
 */
export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      { $set: { status: req.body.status } },
      { new: true, runValidators: true }
    ).lean();

    if (!payment) {
      return next(new AppError({ 
        message: "Pagamento não encontrado.", 
        statusCode: HttpStatus.NOT_FOUND 
      }));
    }
    
    res.status(HttpStatus.OK).json({ status: "success", data: { payment } });
  } catch (error) {
    next(new AppError({ 
      message: "Erro ao atualizar status.", 
      statusCode: HttpStatus.BAD_REQUEST 
    }));
  }
};

/**
 * 🗑️ DELETAR PAGAMENTO
 * ✅ Adicionado para completar o CRUD profissional.
 */
export const deletePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await Payment.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!payment) {
      return next(new AppError({ 
        message: "Pagamento não encontrado ou sem permissão para excluir.", 
        statusCode: HttpStatus.NOT_FOUND 
      }));
    }

    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};