import { Request, Response, NextFunction } from "express";
import Property from "../properties/property.model.js";
import Contract from "../contracts/contract.model.js";
import Payment from "../payments/payment.model.js";
import { AppError } from "../../shared/errors/AppError.js";

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) throw new AppError("Acesso não autorizado.", 401);

    // Pegamos a data de início e fim do mês atual para métricas financeiras
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [propertyMetrics, contractMetrics, financialMetrics] = await Promise.all([
      // 1. Métricas de Imóveis: Total e Taxa de Ocupação
      Property.aggregate([
        { $match: { owner: ownerId } },
        { $group: {
            _id: null,
            total: { $sum: 1 },
            available: { $sum: { $cond: [{ $eq: ["$status", "Disponível"] }, 1, 0] } },
            rented: { $sum: { $cond: [{ $eq: ["$status", "Alugado"] }, 1, 0] } }
        }}
      ]),

      // 2. Contratos Ativos
      Contract.countDocuments({ owner: ownerId, status: 'active' }),

      // 3. Financeiro Detalhado: Receita do Mês vs Inadimplência
      Payment.aggregate([
        { $match: { 
            owner: ownerId, 
            dueDate: { $gte: startOfMonth, $lte: endOfMonth } 
        }},
        { $group: {
            _id: null,
            expected: { $sum: "$amount" },
            received: { $sum: { $cond: [{ $eq: ["$status", "Pago"] }, "$amount", 0] } },
            overdue: { $sum: { $cond: [{ $eq: ["$status", "Atrasado"] }, "$amount", 0] } },
            pending: { $sum: { $cond: [{ $eq: ["$status", "Pendente"] }, "$amount", 0] } }
        }}
      ])
    ]);

    // Formatação amigável para o Front-end (Vite/React)
    const stats = {
      inventory: propertyMetrics[0] || { total: 0, available: 0, rented: 0 },
      contracts: { active: contractMetrics },
      finance: financialMetrics[0] || { expected: 0, received: 0, overdue: 0, pending: 0 }
    };

    // Cálculo de Taxa de Ocupação (Técnica moderna de backend analítico)
    const occupancyRate = stats.inventory.total > 0 
      ? (stats.inventory.rented / stats.inventory.total) * 100 
      : 0;

    res.status(200).json({
      status: "success",
      data: {
        ...stats,
        occupancyRate: Number(occupancyRate.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
};