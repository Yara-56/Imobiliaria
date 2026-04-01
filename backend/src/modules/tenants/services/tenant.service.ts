import { ITenantRepository, CreateTenantData, UpdateTenantData } from '../domain/repositories/tenant.repository.interface.js';
import { Tenant } from '../domain/entities/tenant.entity.js';
import { createLogger } from '../../../core/logger/logger.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { HttpStatus } from '../../../shared/errors/http-status.js';
import { ErrorCodes } from '../../../shared/errors/error-codes';

const logger = createLogger('TenantService');

export class TenantService {
  constructor(private readonly repo: ITenantRepository) {}

  async create(data: CreateTenantData): Promise<Tenant> {
    try {
      logger.debug('📥 Iniciando criação de inquilino', {
        fullName: data.fullName,
        tenantId: data.tenantId,
      });

      if (!data.fullName?.trim()) {
        throw new AppError({
          message: 'Nome completo é obrigatório',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: ErrorCodes.VALIDATION_ERROR,
          details: { field: 'fullName' }
        });
      }

      if (!data.tenantId) {
        throw new AppError({
          message: 'TenantId é obrigatório',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: ErrorCodes.VALIDATION_ERROR,
          details: { field: 'tenantId' }
        });
      }

      if (data.cpf) {
        const existingByCPF = await this.repo.findByCPF?.(data.cpf, data.tenantId);
        if (existingByCPF) {
          throw new AppError({
            message: 'CPF já cadastrado para este tenant',
            statusCode: HttpStatus.CONFLICT,
            errorCode: ErrorCodes.DUPLICATE_ENTRY,
            details: { field: 'cpf' }
          });
        }
      }

      if (data.email) {
        const existingByEmail = await this.repo.findByEmail?.(data.email, data.tenantId);
        if (existingByEmail) {
          throw new AppError({
            message: 'Email já cadastrado para este tenant',
            statusCode: HttpStatus.CONFLICT,
            errorCode: ErrorCodes.DUPLICATE_ENTRY,
            details: { field: 'email' }
          });
        }
      }

      const tenant = await this.repo.create(data);
      logger.info('✅ Inquilino criado com sucesso', { id: tenant.id });
      return tenant;

    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error('❌ Erro ao criar inquilino', error as Error);
      throw new AppError({
        message: 'Erro ao criar inquilino',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCodes.INTERNAL_ERROR
      });
    }
  }

  async findAll(tenantId: string, query?: any): Promise<Tenant[]> {
    try {
      return await this.repo.findAll(tenantId, query);
    } catch (error) {
      throw new AppError({
        message: 'Erro ao listar inquilinos',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async findById(id: string, tenantId: string): Promise<Tenant | null> {
    return await this.repo.findById(id, tenantId);
  }

  async update(id: string, tenantId: string, data: UpdateTenantData): Promise<Tenant> {
    const existing = await this.findById(id, tenantId);
    if (!existing) {
      throw new AppError({
        message: 'Inquilino não encontrado',
        statusCode: HttpStatus.NOT_FOUND
      });
    }
    return await this.repo.update(id, tenantId, data);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    const existing = await this.findById(id, tenantId);
    if (!existing) {
      throw new AppError({
        message: 'Inquilino não encontrado',
        statusCode: HttpStatus.NOT_FOUND
      });
    }
    await this.repo.delete(id, tenantId);
  }
}