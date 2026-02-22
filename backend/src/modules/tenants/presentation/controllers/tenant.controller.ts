import { Request, Response, NextFunction } from "express";
import { BaseCrudController } from "../../../../shared/http/base-crud-controller.js";
import { TenantService } from "../../application/services/tenant.service.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";

export class TenantController extends BaseCrudController<any> {
  constructor() {
    super(new TenantService());
  }

  /**
   * ✅ MÉTODO SOBRESCRITO: 
   * Garante o formato { data: [...] } para o seu hook useTenants.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // O service deve retornar a lista de inquilinos da AuraImobi
      const tenants = await this.service.findAll();
      
      res.status(HttpStatus.OK).json({ 
        status: "success",
        data: tenants 
      });
    } catch (error) {
      next(error);
    }
  }
}

export const tenantController = new TenantController();