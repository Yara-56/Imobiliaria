import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { PropertyService } from "../services/PropertyService.ts"; // ✅ Ajustado para .ts
import { HttpStatus } from "../../../shared/infra/http/http-status.ts"; // ✅ Caminho corrigido para infra
import { AppError } from "../../../shared/errors/AppError.ts"; // ✅ Ajustado para .ts
import { container } from "tsyringe";

@injectable()
export class PropertiesController {
  constructor(
    // ✅ No tsyringe, se a classe é injectable, ele resolve o Singleton automaticamente
    private propertyService: PropertyService
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, id: userId } = req.user!;
      const property = await this.propertyService.create({ ...req.body, tenantId, userId }, req.file);
      res.status(HttpStatus.CREATED).json({ status: "success", data: { property } });
    } catch (error) { next(error); }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });
      }
      const property = await this.propertyService.getById(id, tenantId);
      res.status(HttpStatus.OK).json({ status: "success", data: { property } });
    } catch (error) { next(error); }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });
      }
      const properties = await this.propertyService.listAll(tenantId, req.query);
      res.status(HttpStatus.OK).json({ status: "success", results: (properties as any).length, data: { properties } });
    } catch (error) { next(error); }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });
      }

      const updated = await this.propertyService.update(id, tenantId, req.body, req.file);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "Imóvel atualizado com sucesso!",
        data: { property: updated }
      });
    } catch (error) { next(error); }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });
      }
      await this.propertyService.delete(id, tenantId);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) { next(error); }
  };
}

/**
 * 🚀 A PEÇA QUE FALTA:
 * Resolvemos o Controller através do container do tsyringe para que o 
 * PropertyService seja injetado automaticamente sem erros de 'undefined'.
 */
export const propertyController = container.resolve(PropertiesController);