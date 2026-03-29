import { Request, Response, NextFunction } from "express";
import { PropertyService } from "../application/services/PropertyService.js";
// ✅ IMPORTANTE: O nome da classe no seu arquivo era 'PropertyRepository'
import { PropertyRepository } from "../infrastructure/repositories/PrismaPropertyRepository.js"; 
import { HttpStatus } from "../../../shared/errors/http-status.js";
import { AppError } from "../../../shared/errors/AppError.js";

// Instanciamos as dependências de forma manual (como você solicitou)
const repository = new PropertyRepository();
const propertyService = new PropertyService(repository);

export class PropertyController {
  
  /**
   * ➕ CRIAR IMÓVEL
   * Suporta FormData (JSON + Arquivo PDF da Escritura)
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 🛡️ Validação de segurança para o TypeScript (req.user)
      if (!req.user) {
        throw new AppError({
          message: "Usuário não autenticado ou token inválido.",
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }

      const { tenantId, id: userId } = req.user;
      const file = req.file; // Capturado pelo middleware propertyUpload.single('escritura')

      const property = await propertyService.create(
        { 
          ...req.body, 
          tenantId, 
          userId,
          // Nota: rentValue virá como string no FormData, o Service tratará para Number
        }, 
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

      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });

      const property = await propertyService.getById(id, tenantId);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { property }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 📄 LISTAR TODOS
   */
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });

      const filters = req.query; 

      const properties = await propertyService.listAll(tenantId, filters);

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
   * 🗑️ DELETAR
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) throw new AppError({ message: "Não autorizado", statusCode: HttpStatus.UNAUTHORIZED });

      await propertyService.delete(id, tenantId);

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}