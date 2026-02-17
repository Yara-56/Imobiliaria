import { Request, Response, NextFunction } from "express";
import Payment from "./payment.model.js";
import { AppError } from "../../shared/errors/AppError.js";

// 📊 Listar pagamentos (Isolamento de Segurança)
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

// 💸 Criar novo pagamento (Capturando 'documents[]')
export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 🛡️ Captura os arquivos do Multer injetados no request
    const files = (req as any).files as any[]; 
    
    // ✅ Caminho sincronizado com a pasta 'uploads' na raiz do seu backend
    const receiptUrl = files && files.length > 0 
      ? `/uploads/${files[0].filename}` 
      : undefined;

    const payment = await Payment.create({
      ...req.body,
      receiptUrl,
      owner: req.user?.id
    });
    
    res.status(201).json(payment);
  } catch (error) {
    // 🛡️ Tratamento para duplicidade de mês (MM/AAAA)
    if ((error as any).code === 11000) {
      return next(new AppError("Já existe um pagamento registrado para este mês.", 400));
    }
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

// ✅ Atualizar Status (ts(2339) resolvido)
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
    next(new AppError("Erro ao atualizar status.", 400));
  }
};