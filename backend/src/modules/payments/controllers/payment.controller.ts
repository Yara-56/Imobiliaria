import { type Request, type Response, type NextFunction } from "express";
/** * ✅ No NodeNext, o import deve terminar em .js, mas o TS buscará o arquivo .ts.
 * Se a linha vermelha persistir, use o Restart TS Server.
 */
import Payment from "../models/payment.model.js"; 
import { AppError } from "@shared/errors/AppError.js";

/**
 * 📊 LISTAR PAGAMENTOS (Multi-tenancy)
 */
export const listPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 🛡️ Filtro de segurança: Garante isolamento total entre admins
    const payments = await Payment.find({ owner: req.user?.id })
      .populate("contractId", "landlordName propertyAddress")
      .sort("-paymentDate")
      .lean(); // ✅ Retorna objetos puros para performance no React

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
 * 💸 CRIAR NOVO PAGAMENTO (Com Upload)
 */
export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 🛡️ Tipagem para os arquivos injetados pelo Multer
    const files = (req as any).files as Express.Multer.File[];

    const receiptUrl =
      files && files.length > 0 ? `/uploads/${files[0].filename}` : undefined;

    const payment = await Payment.create({
      ...req.body,
      receiptUrl,
      owner: req.user?.id, // ✅ Vincula o pagamento ao admin logado
    });

    res.status(201).json({ status: "success", data: { payment } });
  } catch (error: any) {
    // 🛡️ Impede pagamentos duplicados no mesmo mês (MM/AAAA)
    if (error.code === 11000) {
      return next(new AppError("Já existe um pagamento para este mês.", 400));
    }
    next(new AppError(error.message || "Erro ao registrar pagamento.", 400));
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
    next(new AppError("Erro ao buscar pagamento.", 500));
  }
};

/**
 * ✅ ATUALIZAR STATUS (Pendente -> Pago)
 */
export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, owner: req.user?.id },
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!payment) return next(new AppError("Pagamento não encontrado.", 404));
    res.status(200).json({ status: "success", data: { payment } });
  } catch (error) {
    next(new AppError("Erro ao atualizar status.", 400));
  }
};