import { type Request, type Response, type NextFunction } from "express";
import { Payment } from "../models/payment.model.js"; 
import { AppError } from "../../../shared/errors/AppError.js";

/**
 * 📊 LISTAR PAGAMENTOS (Multi-tenancy)
 * Filtra por owner para garantir que o admin veja apenas seus dados.
 */
export const listPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payments = await Payment.find({ owner: req.user?.id })
      .populate("tenantId", "fullName")
      .populate("contractId", "landlordName propertyAddress")
      .sort("-paymentDate")
      .lean(); 

    res.status(200).json({
      status: "success",
      results: payments.length,
      data: { payments },
    });
  } catch (error: any) {
    next(new AppError("Erro ao carregar pagamentos.", 500));
  }
};

/**
 * 💸 CRIAR PAGAMENTO
 */
export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await Payment.create({
      ...req.body,
      owner: req.user?.id, 
    });
    res.status(201).json({ status: "success", data: { payment } });
  } catch (error: any) {
    next(new AppError("Erro ao registrar pagamento.", 400));
  }
};

/**
 * 🔍 BUSCAR POR ID (CORREÇÃO DO ERRO TS2305)
 */
export const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      owner: req.user?.id, // 🛡️ Segurança: Isolamento de dados
    }).lean();

    if (!payment) return next(new AppError("Pagamento não encontrado.", 404));
    res.status(200).json({ status: "success", data: { payment } });
  } catch (error) {
    next(new AppError("Erro ao buscar pagamento.", 500));
  }
};

/**
 * ✅ ATUALIZAR STATUS
 */
export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, owner: req.user?.id },
      { status: req.body.status },
      { new: true, runValidators: true }
    ).lean();

    if (!payment) return next(new AppError("Pagamento não encontrado.", 404));
    res.status(200).json({ status: "success", data: { payment } });
  } catch (error) {
    next(new AppError("Erro ao atualizar status.", 400));
  }
};