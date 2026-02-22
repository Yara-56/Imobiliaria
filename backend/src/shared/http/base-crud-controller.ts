// CAMINHO COMPLETO: backend/src/shared/http/base-crud-controller.ts
import { Request, Response } from "express";
import { BaseResponse } from "./base-response.js";
import { asyncHandler } from "./async-handler.js";
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";

export abstract class BaseCrudController<T> {
  constructor(protected service: any) {}

  /**
   * 🛡️ Helper Privado: Garante que o tenantId existe (Cybersecurity)
   * Evita o erro "Cannot read properties of undefined (reading 'tenantId')"
   */
  private getTenantId(req: any): string {
    const tenantId = req.user?.tenantId;
    
    if (!tenantId) {
      throw new AppError({
        message: "Acesso negado. Usuário não autenticado ou sem Tenant associado.",
        statusCode: HttpStatus.UNAUTHORIZED
      });
    }
    
    return tenantId;
  }

  create = asyncHandler(async (req: any, res: Response) => {
    // Injetamos o tenantId no corpo da requisição para garantir o isolamento
    const tenantId = this.getTenantId(req);
    const result = await this.service.create({ ...req.body, tenantId });

    return res.status(HttpStatus.CREATED).json(
      BaseResponse.success(result, "Criado com sucesso")
    );
  });

  findAll = asyncHandler(async (req: any, res: Response) => {
    const { page, limit, search } = req.query;
    const tenantId = this.getTenantId(req);

    const result = await this.service.findAll(tenantId, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search,
    });

    return res.json(
      BaseResponse.paginated(
        result.data,
        Number(page) || 1,
        Number(limit) || 10,
        result.total
      )
    );
  });

  findById = asyncHandler(async (req: any, res: Response) => {
    const tenantId = this.getTenantId(req);
    const result = await this.service.findById(
      req.params.id,
      tenantId
    );
    return res.json(BaseResponse.success(result));
  });

  update = asyncHandler(async (req: any, res: Response) => {
    const tenantId = this.getTenantId(req);
    const result = await this.service.update(
      req.params.id,
      tenantId,
      req.body
    );
    return res.json(BaseResponse.success(result));
  });

  delete = asyncHandler(async (req: any, res: Response) => {
    const tenantId = this.getTenantId(req);
    await this.service.delete(req.params.id, tenantId);
    return res.status(HttpStatus.NO_CONTENT).send();
  });
}