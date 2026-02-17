import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Property from "../properties/property.model.js";
import Contract from "../contracts/contract.model.js";
import Payment from "../payments/payment.model.js";
import { AppError } from "../../shared/errors/AppError.js";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) throw new AppError("Acesso não autorizado.", 401);

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(-1);

    const [propertyMetrics, activeContracts, financialMetrics] =
      await Promise.all([
        Property.aggregate([
          { $match: { owner: ownerObjectId } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              available: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Disponível"] }, 1, 0],
                },
              },
              rented: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Alugado"] }, 1, 0],
                },
              },
            },
          },
        ]),

        Contract.countDocuments({ owner: ownerObjectId, status: "active" }),

        Payment.aggregate([
          {
            $match: {
              owner: ownerObjectId,
              dueDate: { $gte: startOfMonth, $lte: endOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              expected: { $sum: "$amount" },
              received: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Pago"] }, "$amount", 0],
                },
              },
              overdue: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Atrasado"] }, "$amount", 0],
                },
              },
              pending: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Pendente"] }, "$amount", 0],
                },
              },
            },
          },
        ]),
      ]);

    const inventory = propertyMetrics[0] || {
      total: 0,
      available: 0,
      rented: 0,
    };

    const finance = financialMetrics[0] || {
      expected: 0,
      received: 0,
      overdue: 0,
      pending: 0,
    };

    const occupancyRate =
      inventory.total > 0 ? (inventory.rented / inventory.total) * 100 : 0;

    return res.status(200).json({
      status: "success",
      data: {
        inventory,
        contracts: {
          active: activeContracts,
        },
        finance,
        occupancyRate: Number(occupancyRate.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};
