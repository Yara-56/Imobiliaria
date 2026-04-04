import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { PropertyService } from "../services/PropertyService"; // Removi o .js
import { HttpStatus } from "../../../shared/errors/http-status";
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class PropertiesController {
  constructor(
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
      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });
      const property = await this.propertyService.getById(id, tenantId);
      res.status(HttpStatus.OK).json({ status: "success", data: { property } });
    } catch (error) { next(error); }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });
      const properties = await this.propertyService.listAll(tenantId, req.query);
      res.status(HttpStatus.OK).json({ status: "success", results: properties.length, data: { properties } });
    } catch (error) { next(error); }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;
      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });

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
      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });
      await this.propertyService.delete(id, tenantId);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) { next(error); }
  };
}