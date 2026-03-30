// CAMINHO: backend/src/modules/properties/controllers/PropertiesController.ts
import { Request, Response, NextFunction } from "express";
import { PropertyService } from "../application/services/PropertyService.js";
import { PropertyRepository } from "../infrastructure/repositories/PrismaPropertyRepository.js"; 
import { HttpStatus } from "../../../shared/errors/http-status.js";
import { AppError } from "../../../shared/errors/AppError.js";

/**
 * ✅ RASTRO PROFISSIONAL:
 * Centralização da lógica de controle de Imóveis (Properties).
 * Implementado com Injeção de Dependência manual conforme arquitetura ImobiSys.
 */
class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    // Instanciação manual das dependências
    const repository = new PropertyRepository();
    this.propertyService = new PropertyService(repository);

    // 💡 IMPORTANTE: Faz o bind dos métodos para garantir que o 'this' não seja perdido no Express
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * ➕ CRIAR IMÓVEL
   * Suporta FormData (JSON + Arquivo PDF/Image)
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: "Usuário não autenticado.",
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }

      const { tenantId, id: userId } = req.user;
      const file = req.file; 

      const property = await this.propertyService.create(
        { ...req.body, tenantId, userId }, 
        file
      );

      res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "Imóvel cadastrado com sucesso!",
        data: { property }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 🔍 BUSCAR POR ID
   */
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) throw new AppError({ message: "Tenant ID ausente", statusCode: HttpStatus.UNAUTHORIZED });

      const property = await this.propertyService.getById(id, tenantId);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { property }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 📄 LISTAR TODOS (Com filtros)
   */
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) throw new AppError({ message: "Tenant ID ausente", statusCode: HttpStatus.UNAUTHORIZED });

      const properties = await this.propertyService.listAll(tenantId, req.query);

      res.status(HttpStatus.OK).json({
        status: "success",
        results: properties.length,
        data: { properties }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 📝 ATUALIZAR IMÓVEL
   * ✅ ESSENCIAL: Resolve o erro de rota que estava faltando este método
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;
      const file = req.file;

      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });

      const updatedProperty = await this.propertyService.update(id, tenantId, req.body, file);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "Imóvel atualizado com sucesso!",
        data: { property: updatedProperty }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 🗑️ DELETAR IMÓVEL
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });

      await this.propertyService.delete(id, tenantId);

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

// ✅ Exportamos a instância pronta para uso nas rotas
export const propertyController = new PropertyController();