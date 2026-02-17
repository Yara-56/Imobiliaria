import { Request, Response, NextFunction } from "express";
import Payment from "./payment.model.js";
import { AppError } from "../../shared/errors/AppError.ts";

// 📊 Listar pagamentos (Segurança: Apenas os da Yara/Admin)
export const listPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await Payment.find({ owner: req.user?.id })
      .populate("contractId", "landlordName propertyAddress")
      .sort("-paymentDate");
    res.status(200).json(payments);
  } catch (error) {
    next(new AppError("Erro ao carregar pagamentos.", 500));
  }
};

// 💸 Criar novo pagamento (Já preparado para o PDF)
export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      owner: req.user?.id
    });
    res.status(201).json(payment);
  } catch (error) {
    next(new AppError("Erro ao registrar pagamento.", 400));
  }
};

// 🔍 Buscar pagamento por ID
export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, owner: req.user?.id });
    if (!payment) return next(new AppError("Pagamento não encontrado.", 404));
    res.status(200).json(payment);
  } catch (error) {
    next(new AppError("Erro ao buscar pagamento.", 500));
  }
};

// ✅ ESTAVA FALTANDO: Atualizar Status (Resolve o erro ts(2339))
export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, owner: req.user?.id },
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) return next(new AppError("Pagamento não encontrado.", 404));

    res.status(200).json(payment);
  } catch (error) {
    next(new AppError("Erro ao atualizar status do pagamento.", 400));
  }
};