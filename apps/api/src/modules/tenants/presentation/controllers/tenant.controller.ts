import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { TenantService } from "../../application/services/tenant.service.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { AppError } from "../../../../shared/errors/AppError.js";
import { logger } from "../../../../shared/utils/logger.js";
import type { CreateTenantData } from "../../domain/repositories/ITenantRepository.js";

/**
 * 🔐 Tipagem estrita para o usuário vindo do Middleware de Auth
 */
interface AuthUser {
  id: string;
  tenantId: string;
}

@injectable()
export class TenantController {
  constructor(private tenantService: TenantService) {}

  /**
   * ➕ CRIAR INQUILINO (Renter)
   * ✅ Suporta envio de arquivos (req.file) para o perfil
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      
      if (!user) {
        throw new AppError({ message: "Sessão expirada.", statusCode: HttpStatus.UNAUTHORIZED });
      }

      const { fullName, email, phone, document } = req.body;
      const file = req.file; // Arquivo vindo do Multer (ex: foto do RG/CPF)

      if (!fullName?.trim()) {
        throw new AppError({ message: "O nome completo é obrigatório.", statusCode: HttpStatus.BAD_REQUEST });
      }

      // ✅ TIPAGEM CORRIGIDA: Usamos 'undefined' para compatibilidade com o DTO
      const tenantData: CreateTenantData = {
        fullName: fullName.trim(),
        email: email?.trim() || undefined,
        phone: phone?.trim() || undefined,
        cpf: document?.trim() || undefined,
        tenantId: user.tenantId,
        userId: user.id,
      };

      logger.info({ tenantId: user.tenantId, renterName: fullName }, "🏗️ Iniciando criação de inquilino");

      const tenant = await this.tenantService.create(tenantData, file);

      res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "Inquilino cadastrado com sucesso!",
        data: { tenant },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 📄 LISTAR TODOS (Com isolamento total SaaS)
   */
  public findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      
      const query = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search as string,
      };

      const result = await this.tenantService.findAll(user.tenantId, query);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 🔎 BUSCAR POR ID
   */
  public findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = req.user as AuthUser;
      
      const tenant = await this.tenantService.findById(id, user.tenantId);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: { tenant }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ✏️ ATUALIZAR INQUILINO
   */
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = req.user as AuthUser;
      
      const updatedTenant = await this.tenantService.update(id, user.tenantId, req.body, req.file);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "Dados atualizados!",
        data: { tenant: updatedTenant }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ❤️ HEALTH CHECK
   */
  public healthCheck = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    res.status(HttpStatus.OK).json({
      status: "success",
      data: {
        status: "online",
        tenantContext: user?.tenantId ?? "unknown",
        serverTime: new Date().toISOString()
      },
    });
  };
}