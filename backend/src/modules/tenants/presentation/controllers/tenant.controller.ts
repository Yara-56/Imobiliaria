import { Request, Response, NextFunction } from "express";
import { BaseCrudController } from "../../../../shared/http/base-crud-controller.js";
import { TenantService } from "../../application/services/tenant.service.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { AppError } from "../../../../shared/errors/AppError.js";

/**
 * Tipagem do usuário autenticado no request
 */
interface AuthUser {
  id: string;
  tenantId: string;
}

/**
 * DTO de criação de inquilino
 */
interface CreateTenantDTO {
  name: string;
  email?: string | null;
  propertyId: string;
  tenantId: string;
  userId: string;
}

/**
 * 🏢 TenantController
 * Gerencia o CRUD de inquilinos com isolamento Multi-tenant
 */
export class TenantController extends BaseCrudController<CreateTenantDTO> {
  constructor() {
    super(new TenantService());
  }

  /**
   * ➕ CRIAR INQUILINO
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;

      const { name, email, propertyId } = req.body;

      if (!name || typeof name !== "string") {
        throw new AppError({
          message: "O campo 'name' (nome do inquilino) é obrigatório.",
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (!propertyId || typeof propertyId !== "string") {
        throw new AppError({
          message: "É necessário vincular o inquilino a um imóvel (propertyId).",
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const tenantData: CreateTenantDTO = {
        name,
        email: email ?? null,
        propertyId,
        tenantId: user.tenantId,
        userId: user.id,
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
   * 📥 LISTAR TODOS
   */
  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;

      const tenants = await this.service.findAll(user.tenantId);

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
      const user = req.user as AuthUser;
      const { id } = req.params;

      const tenant = await this.service.findById(id, user.tenantId);

      if (!tenant) {
        throw new AppError({
          message: "Inquilino não encontrado.",
          statusCode: HttpStatus.NOT_FOUND,
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
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const { id } = req.params;

      const updatedTenant = await this.service.update(
        id,
        user.tenantId,
        req.body
      );

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
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const { id } = req.params;

      await this.service.delete(id, user.tenantId);

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * ❤️ HEALTH CHECK
   */
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;

    res.status(HttpStatus.OK).json({
      status: "success",
      data: {
        status: "online",
        timestamp: new Date().toISOString(),
        tenantContext: user?.tenantId ?? "unknown",
      },
    });
  };
}

/**
 * Instância única do controller
 */
export const tenantController = new TenantController();