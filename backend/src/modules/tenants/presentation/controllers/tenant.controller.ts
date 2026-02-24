import { Request, Response, NextFunction } from "express";
import { BaseCrudController } from "../../../../shared/http/base-crud-controller.js";
import { TenantService } from "../../application/services/tenant.service.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";

export class TenantController extends BaseCrudController<any> {
  constructor() {
    super(new TenantService());
  }

  /**
   * 📥 LISTAR TODOS
   * Retorno padronizado para frontend:
   * {
   *   status: "success",
   *   data: { tenants: [] },
   *   meta: { total }
   * }
   */
  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenants = await this.service.findAll();

      res.status(HttpStatus.OK).json({
        status: "success",
        data: {
          tenants: Array.isArray(tenants) ? tenants : [],
        },
        meta: {
          total: Array.isArray(tenants) ? tenants.length : 0,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 🔎 BUSCAR POR ID
   */
  findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = await this.service.findById(req.params.id);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: {
          tenant,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ➕ CRIAR
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = await this.service.create(req.body);

      res.status(HttpStatus.CREATED).json({
        status: "success",
        data: {
          tenant,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ✏️ ATUALIZAR
   */
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = await this.service.update(
        req.params.id,
        req.body
      );

      res.status(HttpStatus.OK).json({
        status: "success",
        data: {
          tenant,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 🗑 DELETAR
   */
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.service.delete(req.params.id);

      res.status(HttpStatus.NO_CONTENT).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ❤️ HEALTH CHECK
   */
  healthCheck = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    res.status(HttpStatus.OK).json({
      status: "success",
      data: {
        status: "online",
        timestamp: new Date().toISOString(),
      },
    });
  };
}

export const tenantController = new TenantController();