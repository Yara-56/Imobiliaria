import type { Request, Response, NextFunction } from "express";
import { prisma } from "@config/database.config.js";
import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";

/**
 * Estatísticas do painel usando Prisma (multi-tenant por `tenantId`).
 */
export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      throw new AppError({
        message: "Acesso não autorizado.",
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const [totalProperties, availableProperties, rentedProperties, activeContracts] =
      await Promise.all([
        prisma.property.count({ where: { tenantId } }),
        prisma.property.count({
          where: { tenantId, status: "AVAILABLE" },
        }),
        prisma.property.count({
          where: { tenantId, status: "RENTED" },
        }),
        prisma.contract.count({
          where: { tenantId, status: "ACTIVE" },
        }),
      ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const paymentsMonth = await prisma.payment.findMany({
      where: {
        tenantId,
        dueDate: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    let expected = 0;
    let received = 0;
    let overdue = 0;
    let pending = 0;

    for (const p of paymentsMonth) {
      expected += p.amount;
      if (p.status === "PAID") received += p.amount;
      else if (p.status === "OVERDUE") overdue += p.amount;
      else if (p.status === "PENDING") pending += p.amount;
    }

    const inventory = {
      total: totalProperties,
      available: availableProperties,
      rented: rentedProperties,
    };

    const finance = {
      expected,
      received,
      overdue,
      pending,
    };

    const occupancyRate =
      inventory.total > 0 ? (inventory.rented / inventory.total) * 100 : 0;

    res.status(HttpStatus.OK).json({
      status: "success",
      data: {
        inventory,
        contracts: { active: activeContracts },
        finance,
        occupancyRate: Number(occupancyRate.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};
