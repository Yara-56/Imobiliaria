import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../config/database.config.js";
import { AppError } from "@/shared/errors/AppError.js";
import { logger } from "@/shared/utils/logger.js";
import { HttpStatus } from "@/shared/errors/http-status.js";
import { GenerateContractPDFService } from "../services/GenerateContractPDFService.js";

export class ContractController {
  private generatePDFService = new GenerateContractPDFService();

  /**
   * GET /contracts
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const contracts = await prisma.contract.findMany({
        where: { tenantId: req.user.tenantId },
        include: {
          property: { select: { id: true, title: true, address: true } },
          renter: { select: { id: true, fullName: true, phone: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(HttpStatus.OK).json({ status: "success", data: { contracts } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /contracts
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        propertyId, renterId, rentAmount, dueDay,
        startDate, endDate, depositValue, paymentMethod,
        contractNumber, notes,
      } = req.body;

      // ✅ CORREÇÃO: Passando como objeto { message, statusCode }
      if (!propertyId || !renterId) {
        throw new AppError({ 
          message: "propertyId e renterId são obrigatórios.", 
          statusCode: HttpStatus.BAD_REQUEST 
        });
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
          contractNumber: contractNumber ?? `CNT-${new Date().getFullYear()}-${Date.now()}`,
          propertyId,
          renterId,
          userId: req.user.id,
          tenantId: req.user.tenantId,
          status: "ACTIVE",
        }
      });

      const pdfInfo = await this.generatePDFService.execute(newContract.id);

      logger.info({ msg: "Contrato e PDF gerados", contractId: newContract.id });

      return res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "Contrato e PDF criados com sucesso!",
        data: { 
          contract: newContract,
          pdfUrl: pdfInfo.url 
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /contracts/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const contract = await prisma.contract.findFirst({
        where: { id, tenantId: req.user.tenantId },
        include: {
          property: true,
          renter: true,
          documents: true,
        },
      });

      // ✅ CORREÇÃO: Passando como objeto
      if (!contract) {
        throw new AppError({ 
          message: "Contrato não encontrado.", 
          statusCode: HttpStatus.NOT_FOUND 
        });
      }

      return res.status(HttpStatus.OK).json({ status: "success", data: { contract } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /contracts/:id/status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await prisma.contract.updateMany({
        where: { id, tenantId: req.user.tenantId },
        data: { status },
      });

      // ✅ CORREÇÃO: Passando como objeto
      if (updated.count === 0) {
        throw new AppError({ 
          message: "Contrato não encontrado.", 
          statusCode: HttpStatus.NOT_FOUND 
        });
      }

      return res.status(HttpStatus.OK).json({ status: "success", message: "Status atualizado!" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /contracts/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await prisma.contract.deleteMany({
        where: { id, tenantId: req.user.tenantId },
      });

      // ✅ CORREÇÃO: Passando como objeto
      if (deleted.count === 0) {
        throw new AppError({ 
          message: "Contrato não encontrado.", 
          statusCode: HttpStatus.NOT_FOUND 
        });
      }

      return res.status(HttpStatus.OK).json({ status: "success", message: "Contrato removido!" });
    } catch (error) {
      next(error);
    }
  }
}