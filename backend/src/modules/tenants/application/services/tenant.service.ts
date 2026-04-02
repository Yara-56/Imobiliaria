import { inject, injectable } from "tsyringe";

import type { ITenantRepository } from "../../domain/repositories/tenant.repository.interface.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";

import { createLogger } from "../../../../core/logger/logger.js";
import { AppError } from "../../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

import { TENANT_TOKENS } from "../../tokens/tenant.tokens.js";

import {
  CreateTenantDTO,
  UpdateTenantDTO,
} from "../dto/tenant.dto.js";

const logger = createLogger("TenantService");

@injectable()
export class TenantService {
  constructor(
    @inject(TENANT_TOKENS.Repository)
    private readonly repo: ITenantRepository
  ) {}

  // =========================
  // CREATE
  // =========================
  async create(data: CreateTenantDTO): Promise<Tenant> {
    try {
      logger.debug("📥 Criando inquilino", data);

      this.validateCreate(data);
      await this.ensureUniqueFields(data);

      const tenant = Tenant.create({
        ...data,
        email: data.email ?? null,
        cpf: data.cpf ?? null,
      });

      const created = await this.repo.create(tenant);

      logger.info("✅ Inquilino criado", { id: created.id });

      return created;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("❌ Erro ao criar inquilino", { error });

      throw new AppError({
        message: "Erro ao criar inquilino",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCodes.INTERNAL_ERROR,
      });
    }
  }

  // =========================
  // FIND ALL
  // =========================
  async findAll(tenantId: string): Promise<Tenant[]> {
    if (!tenantId) {
      throw new AppError({
        message: "TenantId é obrigatório",
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR,
      });
    }

    return this.repo.findAll(tenantId);
  }

  // =========================
  // FIND BY ID
  // =========================
  async findById(id: string, tenantId: string): Promise<Tenant> {
    const tenant = await this.repo.findById(id, tenantId);

    if (!tenant) {
      throw new AppError({
        message: "Inquilino não encontrado",
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
      });
    }

    return tenant;
  }

  // =========================
  // UPDATE
  // =========================
  async update(
    id: string,
    tenantId: string,
    data: UpdateTenantDTO
  ): Promise<Tenant> {
    try {
      const tenant = await this.findById(id, tenantId);

      // 🔥 Atualizações controladas pela Entity
      if (data.fullName !== undefined) {
        tenant.updateFullName(data.fullName);
      }

      if (data.email !== undefined) {
        tenant.updateEmail(data.email);
      }

      if (data.cpf !== undefined) {
        tenant.updateCPF(data.cpf);
      }

      if (data.phone !== undefined) {
        tenant.updatePhone(data.phone);
      }

      if (data.notes !== undefined) {
        tenant.updateNotes(data.notes);
      }

      const updated = await this.repo.update(tenant);

      logger.info("✏️ Inquilino atualizado", { id });

      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("❌ Erro ao atualizar", { error });

      throw new AppError({
        message: "Erro ao atualizar inquilino",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCodes.INTERNAL_ERROR,
      });
    }
  }

  // =========================
  // DELETE
  // =========================
  async delete(id: string, tenantId: string): Promise<void> {
    const tenant = await this.findById(id, tenantId);

    await this.repo.delete(tenant.id, tenant.tenantId);

    logger.info("🗑️ Inquilino removido", { id });
  }

  // =========================
  // VALIDATION
  // =========================
  private validateCreate(data: CreateTenantDTO): void {
    if (!data.fullName?.trim()) {
      throw new AppError({
        message: "Nome é obrigatório",
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR,
      });
    }

    if (!data.tenantId) {
      throw new AppError({
        message: "TenantId obrigatório",
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR,
      });
    }
  }

  private async ensureUniqueFields(data: CreateTenantDTO) {
    if (data.email) {
      const exists = await this.repo.findByEmail(data.email, data.tenantId);

      if (exists) {
        throw new AppError({
          message: "Email já cadastrado",
          statusCode: HttpStatus.CONFLICT,
          errorCode: ErrorCodes.DUPLICATE_ENTRY,
        });
      }
    }

    if (data.cpf) {
      const exists = await this.repo.findByCPF(data.cpf, data.tenantId);

      if (exists) {
        throw new AppError({
          message: "CPF já cadastrado",
          statusCode: HttpStatus.CONFLICT,
          errorCode: ErrorCodes.DUPLICATE_ENTRY,
        });
      }
    }
  }
}