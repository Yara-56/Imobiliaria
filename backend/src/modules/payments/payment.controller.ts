import { Request, Response, NextFunction } from "express";
import Payment from "../../models/payment.model"; // Sem o .js se usar tsx
import { AppError } from "../../shared/errors/AppError";

interface AuthenticatedRequest extends Request {
  user?: { _id: string; role: string };
}

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { contractId, tenantId, amount, paymentDate, method, status } = req.body;

    // Criando o registro vinculado ao dono (sua avó ou corretor logado)
    const payment = await Payment.create({
      contractId,
      tenantId,
      amount,
      paymentDate,
      method,
      status,
      owner: authReq.user?._id // O campo 'owner' definido no seu model
    });

    res.status(201).json({
      status: "success",
      data: payment
    });
  } catch (error) {
    next(new AppError("Erro ao registrar pagamento", 400));
  }
};