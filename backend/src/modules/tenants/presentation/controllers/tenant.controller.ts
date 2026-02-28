import { Request, Response, NextFunction } from "express";
import { BaseCrudController } from "../../../../shared/http/base-crud-controller.js";
import { TenantService } from "../../application/services/tenant.service.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";

/**
 * 🏢 TenantController
 * Gerencia o CRUD de inquilinos com isolamento total entre imobiliárias (SaaS).
 */
export class TenantController extends BaseCrudController<any> {
  constructor() {
    // Injeta o serviço especializado
    super(new TenantService());
  }

  /**
   * 📥 LISTAR TODOS (Filtrado por Imobiliária)
   */
  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = req.user; // Extraído do Token pelo Middleware Protect
      const tenants = await this.service.findAll(tenantId);

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
   * 🔎 BUSCAR POR ID (Validando Posse)
   */
  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { tenantId } = req.user;

      const tenant = await this.service.findById(id, tenantId);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { tenant },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ➕ CRIAR NOVO INQUILINO
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Injeta os IDs de segurança antes de mandar pro banco
      const data = {
        ...req.body,
        tenantId: req.user.tenantId,
        userId: req.user.id, 
      };

      const tenant = await this.service.create(data);

      res.status(HttpStatus.CREATED).json({
        status: "success",
        data: { tenant },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ✏️ ATUALIZAR INQUILINO
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { tenantId } = req.user;

      const tenant = await this.service.update(id, tenantId, req.body);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { tenant },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 🗑 DELETAR INQUILINO
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { tenantId } = req.user;

      await this.service.delete(id, tenantId);

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * ❤️ HEALTH CHECK (Requisito do Frontend)
   */
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    res.status(HttpStatus.OK).json({
      status: "success",
      data: {
        status: "online",
        timestamp: new Date().toISOString(),
        tenantContext: req.user?.tenantId || "unknown"
      },
    });
  };
}

// Exporta a instância pronta para as rotas
export const tenantController = new TenantController();