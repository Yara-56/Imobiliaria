import { Request, Response, NextFunction } from "express";
import { BaseCrudController } from "../../../../shared/http/base-crud-controller.js";
import { TenantService } from "../../application/services/tenant.service.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { AppError } from "../../../../shared/errors/AppError.js";

/**
 * 🏢 TenantController
 * Gerencia o CRUD de inquilinos (Renters) com isolamento Multi-tenant.
 */
export class TenantController extends BaseCrudController<any> {
  constructor() {
    // Injeta o serviço especializado
    super(new TenantService());
  }

  /**
   * ➕ CRIAR NOVO INQUILINO
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, propertyId } = req.body;

      // Validação defensiva para evitar erro 500 no Prisma
      if (!name) {
        throw new AppError({
          message: "O campo 'name' (nome do inquilino) é obrigatório.",
          statusCode: HttpStatus.BAD_REQUEST
        });
      }

      if (!propertyId) {
        throw new AppError({
          message: "É necessário vincular o inquilino a um imóvel (propertyId).",
          statusCode: HttpStatus.BAD_REQUEST
        });
      }

      const tenantData = {
        name,
        email: email || null,
        propertyId,
        tenantId: req.user.tenantId, // ID da Imobiliária logada
        userId: req.user.id,        // ID do usuário logado
      };

      const tenant = await this.service.create(tenantData);

      res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "Inquilino cadastrado com sucesso",
        data: { tenant },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 📥 LISTAR TODOS (Filtrado por Imobiliária)
   */
  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = req.user;
      const tenants = await this.service.findAll(tenantId);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: {
          tenants: Array.isArray(tenants) ? tenants : [],
        },
        meta: {
          total: Array.isArray(tenants) ? tenants.length : 0,
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 🔎 BUSCAR POR ID
   */
  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { tenantId } = req.user;

      const tenant = await this.service.findById(id, tenantId);

      if (!tenant) {
        throw new AppError({
          message: "Inquilino não encontrado.",
          statusCode: HttpStatus.NOT_FOUND
        });
      }

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { tenant },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ✏️ ATUALIZAR
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { tenantId } = req.user;

      const updatedTenant = await this.service.update(id, tenantId, req.body);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { tenant: updatedTenant },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 🗑 DELETAR
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
   * ❤️ HEALTH CHECK
   * Resolve o erro ts(2339) no arquivo de rotas
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

// Exporta a instância única para ser usada nas rotas
export const tenantController = new TenantController();