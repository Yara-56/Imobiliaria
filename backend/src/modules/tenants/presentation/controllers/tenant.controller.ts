import { Request, Response, NextFunction } from "express";
import { BaseCrudController } from "../../../../shared/http/base-crud-controller.js";
import { TenantService } from "../../application/services/tenant.service.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { AppError } from "../../../../shared/errors/AppError.js";
import { logger } from "../../../../shared/utils/logger.js";
import type { CreateTenantData } from "../../domain/repositories/tenant.repository.interface.js";

/**
 * ======================================================
 * 🔐 Tipagem do usuário autenticado
 * ======================================================
 */
interface AuthUser {
  id: string;
  tenantId: string;
}

/**
 * ======================================================
 * 🏢 TenantController
 * ------------------------------------------------------
 * Gerencia o CRUD de inquilinos (Renters) com isolamento
 * multi-tenant. Cada operação filtra por tenantId do
 * usuário autenticado via JWT.
 *
 * ✅ Clean Architecture
 * ✅ Multi-tenant isolation
 * ✅ Tipagem forte
 * ✅ Logs estruturados
 * ======================================================
 */
export class TenantController extends BaseCrudController<CreateTenantData> {
  constructor() {
    super(new TenantService());
  }

  /**
   * ======================================================
   * ➕ CRIAR INQUILINO
   * POST /api/v1/tenants
   * ======================================================
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;

      logger.info({ body: req.body }, "📥 Dados recebidos para novo inquilino");

      const {
        fullName,
        email,
        phone,
        document,
      } = req.body;

      if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
        throw new AppError({
          message: "O campo 'fullName' (nome do inquilino) é obrigatório.",
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // Mapeia explicitamente para CreateTenantData (tipos do repository)
      const tenantData: CreateTenantData = {
        fullName: fullName.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        cpf: document?.trim() || null,  // document do frontend → cpf no banco
        tenantId: user.tenantId,
        userId: user.id,
      };

      logger.info({ tenantData }, "📤 Dados mapeados para repository");

      const tenant = await this.service.create(tenantData);

      logger.info({ tenantId: user.tenantId }, "✅ Inquilino criado com sucesso");

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
   * ======================================================
   * 📄 LISTAR TODOS
   * GET /api/v1/tenants
   * ======================================================
   */
  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;

      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        search: req.query.search as string | undefined,
      };

      const tenants = await this.service.findAll(user.tenantId, query);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: {
          tenants: Array.isArray(tenants) ? tenants : [],
        },
        meta: {
          total: Array.isArray(tenants) ? tenants.length : 0,
          page: query.page,
          limit: query.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ======================================================
   * 🔎 BUSCAR POR ID
   * GET /api/v1/tenants/:id
   * ======================================================
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
   * ======================================================
   * ✏️ ATUALIZAR
   * PATCH /api/v1/tenants/:id
   * ======================================================
   */
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const { id } = req.params;

      logger.info({ id, body: req.body }, "📝 Atualizando inquilino");

      const updatedTenant = await this.service.update(
        id,
        user.tenantId,
        req.body
      );

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "Inquilino atualizado com sucesso",
        data: { tenant: updatedTenant },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ======================================================
   * 🗑 DELETAR
   * DELETE /api/v1/tenants/:id
   * ======================================================
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

      logger.info({ id, tenantId: user.tenantId }, "🗑 Inquilino removido");

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * ======================================================
   * ❤️ HEALTH CHECK
   * GET /api/v1/tenants/health
   * ======================================================
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
 * ======================================================
 * Instância única do controller (Singleton)
 * ======================================================
 */
export const tenantController = new TenantController();