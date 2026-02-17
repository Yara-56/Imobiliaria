import { Request, Response, NextFunction } from "express";
// Como o model está na mesma pasta (visto no seu explorador), o import é direto
import Payment from "./payment.model"; 
import { AppError } from "../../shared/errors/AppError";

interface AuthenticatedRequest extends Request {
  user?: { _id: string; role: string };
}

export const listPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    // Cybersecurity: Cada admin só vê seus próprios registros
    const payments = await Payment.find({ owner: authReq.user?._id })
      .populate("tenantId", "name")
      .populate("contractId", "identifier");

    res.status(200).json({ status: "success", results: payments.length, data: payments });
  } catch (error) {
    next(new AppError("Erro ao buscar pagamentos", 500));
  }
};

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { contractId, tenantId, amount, paymentDate, method, status } = req.body;

    const payment = await Payment.create({
      contractId,
      tenantId,
      amount,
      paymentDate,
      method,
      status,
      owner: authReq.user?._id 
    });

    res.status(201).json({ status: "success", data: payment });
  } catch (error) {
    next(new AppError("Erro ao registrar pagamento", 400));
  }
};