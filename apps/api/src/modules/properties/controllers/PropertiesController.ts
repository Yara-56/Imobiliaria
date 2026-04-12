import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { PROPERTY_TOKENS } from "@modules/properties/tokens/property.tokens.js";
import type { PropertyService } from "../services/PropertyService.js";

import { HttpStatus } from "@shared/infra/http/http-status.js";
import { AppError } from "@shared/errors/AppError.js";

@injectable()
export class PropertiesController {
  constructor(
    @inject(PROPERTY_TOKENS.Service)
    private readonly propertyService: PropertyService
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Garantindo que req.user existe (vindo do middleware de auth)
      if (!req.user) {
        throw new AppError("Não autenticado", HttpStatus.UNAUTHORIZED);
      }

      const { tenantId, id: userId } = req.user;

      const property = await this.propertyService.create(
        { ...req.body, tenantId, userId },
        req.file
      );

      return res.status(HttpStatus.CREATED).json({
        status: "success",
        data: { property },
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        throw new AppError("Não autorizado", HttpStatus.UNAUTHORIZED);
      }

      const property = await this.propertyService.getById(id, tenantId);

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: { property },
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        throw new AppError("Não autorizado", HttpStatus.UNAUTHORIZED);
      }

      const properties = await this.propertyService.listAll(tenantId, req.query);

      return res.status(HttpStatus.OK).json({
        status: "success",
        results: Array.isArray(properties) ? properties.length : 0,
        data: { properties },
      });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        throw new AppError("Não autorizado", HttpStatus.UNAUTHORIZED);
      }

      const updated = await this.propertyService.update(
        id,
        tenantId,
        req.body,
        req.file
      );

      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Imóvel atualizado com sucesso!",
        data: { property: updated },
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        throw new AppError("Não autorizado", HttpStatus.UNAUTHORIZED);
      }

      await this.propertyService.delete(id, tenantId);

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };
}