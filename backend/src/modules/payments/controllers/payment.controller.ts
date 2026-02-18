import { type Request, type Response, type NextFunction } from "express";
import Payment from "../models/payment.model.js"; 
import { AppError } from "../../../shared/errors/AppError.js";

/**
 * 📊 LISTAR PAGAMENTOS (Multi-tenancy)
 */
export const listPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 🛡️ Filtro owner: Garante que um admin não veja dados de outro
    const payments = await Payment.find({ owner: req.user?.id })
      .populate("contractId", "landlordName propertyAddress")
      .sort("-paymentDate")
      .lean(); // ✅ Performance para o React

    res.status(200).json({
      status: "success",
      results: payments.length,
      data: { payments },
    });
  } catch (error: any) {
    next(new AppError("Erro ao carregar pagamentos do nó.", 500));
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
    next(new AppError("Erro ao registrar transação financeira.", 400));
  }
};

/**
 * 🔍 BUSCAR POR ID
 */
export const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      owner: req.user?.id,
    }).lean();

    if (!payment) return next(new AppError("Pagamento não encontrado.", 404));
    res.status(200).json({ status: "success", data: { payment } });
  } catch (error) {
    next(new AppError("Erro ao buscar instância.", 500));
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