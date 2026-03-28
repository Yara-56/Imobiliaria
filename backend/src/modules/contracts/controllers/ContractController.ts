import { Request, Response } from "express";
import { prisma } from "@/config/database.config";
import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";

export class ContractController {
  /**
   * GET /contracts
   */
  async getAll(req: Request, res: Response) {
    try {
      if (!req.user?.tenantId) {
        logger.error("Tentativa sem tenantId em req.user");
        throw new AppError("Tenant inválido.", 401);
      }

      logger.info({
        msg: "Buscando contratos",
        tenantId: req.user.tenantId,
        userId: req.user.id,
      });

      const contracts = await prisma.contract.findMany({
        where: { tenantId: req.user.tenantId },
        include: {
          property: { select: { id: true, title: true, address: true } },
          renter: { select: { id: true, fullName: true, phone: true } },
          payments: {
            select: {
              id: true,
              status: true,
              amount: true,
              dueDate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        status: "success",
        data: { contracts },
      });
    } catch (error) {
      logger.error({
        msg: "Erro no getAll",
        error,
      });
      throw new AppError("Erro ao buscar contratos.", 500);
    }
  }

  /**
   * POST /contracts
   */
  async create(req: Request, res: Response) {
    try {
      const {
        propertyId,
        renterId,
        rentAmount,
        dueDay,
        startDate,
        endDate,
        depositValue,
        paymentMethod,
        contractNumber,
        notes,
      } = req.body;

      if (!propertyId || !renterId) {
        throw new AppError("propertyId e renterId são obrigatórios.", 400);
      }

      logger.info({
        msg: "Criando contrato",
        data: req.body,
        tenantId: req.user.tenantId,
        userId: req.user.id,
      });

      const property = await prisma.property.findFirst({
        where: { id: propertyId, tenantId: req.user.tenantId },
      });

      if (!property) {
        logger.warn({
          msg: "Imóvel não encontrado",
          propertyId,
        });
        throw new AppError("Imóvel não encontrado.", 404);
      }

      const renter = await prisma.renter.findFirst({
        where: { id: renterId, tenantId: req.user.tenantId },
      });

      if (!renter) {
        logger.warn({
          msg: "Inquilino não encontrado",
          renterId,
        });
        throw new AppError("Inquilino não encontrado.", 404);
      }

      const newContract = await prisma.contract.create({
        data: {
          rentAmount: Number(rentAmount),
          dueDay: Number(dueDay),
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          depositValue: depositValue ? Number(depositValue) : null,
          paymentMethod,
          notes,
          contractNumber:
            contractNumber ??
            `CNT-${new Date().getFullYear()}-${Date.now()}`,
          propertyId,
          renterId,
          userId: req.user.id,
          tenantId: req.user.tenantId,
          status: "ACTIVE",
        },
        include: {
          property: { select: { id: true, title: true, address: true } },
          renter: { select: { id: true, fullName: true } },
        },
      });

      return res.status(201).json({
        status: "success",
        message: "Contrato criado com sucesso!",
        data: { contract: newContract },
      });
    } catch (error) {
      logger.error({
        msg: "Erro no create",
        error,
        body: req.body,
      });
      throw new AppError("Erro ao criar contrato.", 500);
    }
  }

  /**
   * GET /contracts/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || id === "undefined") {
        throw new AppError("ID inválido.", 400);
      }

      logger.info({
        msg: "Buscando contrato por ID",
        id,
        tenantId: req.user.tenantId,
      });

      const contract = await prisma.contract.findFirst({
        where: { id, tenantId: req.user.tenantId },
        include: {
          property: true,
          renter: true,
          payments: true,
        },
      });

      if (!contract) {
        logger.warn({
          msg: "Contrato não encontrado",
          id,
          tenantId: req.user.tenantId,
        });
        throw new AppError("Contrato não encontrado.", 404);
      }

      return res.status(200).json({
        status: "success",
        data: { contract },
      });
    } catch (error) {
      logger.error({
        msg: "Erro no getById",
        error,
        params: req.params,
      });
      throw new AppError("Erro ao buscar contrato.", 500);
    }
  }

  /**
   * PATCH /contracts/:id/status
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || id === "undefined") {
        throw new AppError("ID inválido.", 400);
      }

      if (!status) {
        throw new AppError("Status é obrigatório.", 400);
      }

      logger.info({
        msg: "Atualizando status",
        id,
        status,
        tenantId: req.user.tenantId,
      });

      const updated = await prisma.contract.updateMany({
        where: { id, tenantId: req.user.tenantId },
        data: { status },
      });

      if (updated.count === 0) {
        logger.warn({
          msg: "Contrato não encontrado ao atualizar status",
          id,
        });
        throw new AppError("Contrato não encontrado.", 404);
      }

      return res.status(200).json({
        status: "success",
        message: "Status atualizado com sucesso!",
      });
    } catch (error) {
      logger.error({
        msg: "Erro no updateStatus",
        error,
      });
      throw new AppError("Erro ao atualizar status.", 500);
    }
  }

  /**
   * DELETE /contracts/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || id === "undefined") {
        throw new AppError("ID inválido.", 400);
      }

      logger.info({
        msg: "Removendo contrato",
        id,
        tenantId: req.user.tenantId,
      });

      const deleted = await prisma.contract.deleteMany({
        where: { id, tenantId: req.user.tenantId },
      });

      if (deleted.count === 0) {
        logger.warn({
          msg: "Contrato não encontrado ao deletar",
          id,
        });
        throw new AppError("Contrato não encontrado.", 404);
      }

      return res.status(200).json({
        status: "success",
        message: "Contrato removido com sucesso!",
      });
    } catch (error) {
      logger.error({
        msg: "Erro no delete",
        error,
      });
      throw new AppError("Erro ao remover contrato.", 500);
    }
  }
}