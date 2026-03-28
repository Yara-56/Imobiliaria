import { ITenantRepository, CreateTenantData, UpdateTenantData } from '../domain/repositories/tenant.repository.interface';
import { Tenant } from '../domain/entities/tenant.entity';
import { createLogger } from '../../../core/logger/logger';
import { AppError } from '../../../shared/errors/AppError';
import { HttpStatus } from '../../../shared/errors/http-status';

const logger = createLogger('TenantService');

/**
 * ======================================================
 * 🏢 TenantService
 * ======================================================
 * Serviço de negócio para gerenciar inquilinos
 * 
 * Responsabilidades:
 * ✅ Validações de negócio
 * ✅ Orquestração de operações
 * ✅ Logging estruturado
 * ✅ Tratamento de erros
 * ✅ Isolamento multi-tenant
 * ======================================================
 */
export class TenantService {
  /**
   * Constructor com injeção de dependência
   * @param repo - Repositório de tenants
   */
  constructor(private readonly repo: ITenantRepository) {}

  /**
   * ======================================================
   * ➕ CREATE - Criar novo inquilino
   * ======================================================
   * 
   * Validações:
   * - Nome completo obrigatório
   * - TenantId obrigatório (isolamento multi-tenant)
   * - CPF único por tenant
   * - Email único por tenant
   * 
   * @param data - Dados do inquilino
   * @returns Tenant criado
   * @throws AppError se validação falhar
   */
  async create(data: CreateTenantData): Promise<Tenant> {
    try {
      logger.debug('📥 Iniciando criação de inquilino', {
        fullName: data.fullName,
        tenantId: data.tenantId,
      });

      // ============================================
      // VALIDAÇÕES
      // ============================================

      // Validar dados obrigatórios
      if (!data.fullName || typeof data.fullName !== 'string' || !data.fullName.trim()) {
        throw new AppError(
          'Nome completo é obrigatório e deve ser uma string válida',
          HttpStatus.BAD_REQUEST,
          'VALIDATION_ERROR',
          { field: 'fullName' }
        );
      }

      if (!data.tenantId || typeof data.tenantId !== 'string') {
        throw new AppError(
          'TenantId é obrigatório',
          HttpStatus.BAD_REQUEST,
          'VALIDATION_ERROR',
          { field: 'tenantId' }
        );
      }

      // Validar CPF único se fornecido
      if (data.cpf) {
        const existingByCPF = await this.repo.findByCPF?.(data.cpf, data.tenantId);
        if (existingByCPF) {
          logger.warn('CPF já cadastrado', {
            cpf: data.cpf,
            tenantId: data.tenantId,
          });

          throw new AppError(
            'CPF já cadastrado para este tenant',
            HttpStatus.CONFLICT,
            'DUPLICATE_CPF',
            { field: 'cpf' }
          );
        }
      }

      // Validar email único se fornecido
      if (data.email) {
        const existingByEmail = await this.repo.findByEmail?.(data.email, data.tenantId);
        if (existingByEmail) {
          logger.warn('Email já cadastrado', {
            email: data.email,
            tenantId: data.tenantId,
          });

          throw new AppError(
            'Email já cadastrado para este tenant',
            HttpStatus.CONFLICT,
            'DUPLICATE_EMAIL',
            { field: 'email' }
          );
        }
      }

      // ============================================
      // CRIAR
      // ============================================

      const tenant = await this.repo.create(data);

      logger.info('✅ Inquilino criado com sucesso', {
        id: tenant.id,
        tenantId: data.tenantId,
        fullName: data.fullName,
      });

      return tenant;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error('❌ Erro ao criar inquilino', error as Error, {
        data: { fullName: data.fullName, tenantId: data.tenantId },
      });

      throw new AppError(
        'Erro ao criar inquilino',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'CREATE_ERROR'
      );
    }
  }

  /**
   * ======================================================
   * 📄 FIND ALL - Listar inquilinos com paginação
   * ======================================================
   * 
   * @param tenantId - ID do tenant (isolamento)
   * @param query - Parâmetros de paginação e busca
   * @returns Array de tenants
   */
  async findAll(
    tenantId: string,
    query?: { page?: number; limit?: number; search?: string }
  ): Promise<Tenant[]> {
    try {
      logger.debug('📄 Listando inquilinos', {
        tenantId,
        page: query?.page,
        limit: query?.limit,
        search: query?.search,
      });

      const tenants = await this.repo.findAll(tenantId, query);

      logger.info('✅ Inquilinos listados com sucesso', {
        tenantId,
        count: tenants.length,
      });

      return tenants;
    } catch (error) {
      logger.error('❌ Erro ao listar inquilinos', error as Error, {
        tenantId,
      });

      throw new AppError(
        'Erro ao listar inquilinos',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'LIST_ERROR'
      );
    }
  }

  /**
   * ======================================================
   * 🔎 FIND BY ID - Buscar inquilino por ID
   * ======================================================
   * 
   * @param id - ID do inquilino
   * @param tenantId - ID do tenant (isolamento)
   * @returns Tenant ou null se não encontrado
   */
  async findById(id: string, tenantId: string): Promise<Tenant | null> {
    try {
      logger.debug('🔎 Buscando inquilino por ID', {
        id,
        tenantId,
      });

      const tenant = await this.repo.findById(id, tenantId);

      if (!tenant) {
        logger.warn('Inquilino não encontrado', {
          id,
          tenantId,
        });

        return null;
      }

      logger.debug('✅ Inquilino encontrado', {
        id,
        tenantId,
      });

      return tenant;
    } catch (error) {
      logger.error('❌ Erro ao buscar inquilino', error as Error, {
        id,
        tenantId,
      });

      throw new AppError(
        'Erro ao buscar inquilino',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'FIND_ERROR'
      );
    }
  }

  /**
   * ======================================================
   * ✏️ UPDATE - Atualizar inquilino
   * ======================================================
   * 
   * Validações:
   * - Inquilino deve existir
   * - CPF único (se alterado)
   * - Email único (se alterado)
   * 
   * @param id - ID do inquilino
   * @param tenantId - ID do tenant (isolamento)
   * @param data - Dados a atualizar
   * @returns Tenant atualizado
   * @throws AppError se validação falhar
   */
  async update(
    id: string,
    tenantId: string,
    data: UpdateTenantData
  ): Promise<Tenant> {
    try {
      logger.debug('✏️ Atualizando inquilino', {
        id,
        tenantId,
        fields: Object.keys(data),
      });

      // ============================================
      // VALIDAÇÕES
      // ============================================

      // Validar existência
      const existing = await this.findById(id, tenantId);
      if (!existing) {
        throw new AppError(
          'Inquilino não encontrado',
          HttpStatus.NOT_FOUND,
          'NOT_FOUND'
        );
      }

      // Validar CPF único se está atualizando
      if (data.cpf && data.cpf !== existing.cpf) {
        const existingByCPF = await this.repo.findByCPF?.(data.cpf, tenantId);
        if (existingByCPF && existingByCPF.id !== id) {
          logger.warn('CPF já cadastrado para outro inquilino', {
            id,
            tenantId,
            cpf: data.cpf,
          });

          throw new AppError(
            'CPF já cadastrado para outro inquilino',
            HttpStatus.CONFLICT,
            'DUPLICATE_CPF',
            { field: 'cpf' }
          );
        }
      }

      // Validar email único se está atualizando
      if (data.email && data.email !== existing.email) {
        const existingByEmail = await this.repo.findByEmail?.(data.email, tenantId);
        if (existingByEmail && existingByEmail.id !== id) {
          logger.warn('Email já cadastrado para outro inquilino', {
            id,
            tenantId,
            email: data.email,
          });

          throw new AppError(
            'Email já cadastrado para outro inquilino',
            HttpStatus.CONFLICT,
            'DUPLICATE_EMAIL',
            { field: 'email' }
          );
        }
      }

      // ============================================
      // ATUALIZAR
      // ============================================

      const updated = await this.repo.update(id, tenantId, data);

      logger.info('✅ Inquilino atualizado com sucesso', {
        id,
        tenantId,
        fields: Object.keys(data),
      });

      return updated;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error('❌ Erro ao atualizar inquilino', error as Error, {
        id,
        tenantId,
      });

      throw new AppError(
        'Erro ao atualizar inquilino',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UPDATE_ERROR'
      );
    }
  }

  /**
   * ======================================================
   * 🗑️ DELETE - Deletar inquilino
   * ======================================================
   * 
   * @param id - ID do inquilino
   * @param tenantId - ID do tenant (isolamento)
   * @throws AppError se inquilino não encontrado
   */
  async delete(id: string, tenantId: string): Promise<void> {
    try {
      logger.debug('🗑️ Deletando inquilino', {
        id,
        tenantId,
      });

      // Validar existência
      const existing = await this.findById(id, tenantId);
      if (!existing) {
        throw new AppError(
          'Inquilino não encontrado',
          HttpStatus.NOT_FOUND,
          'NOT_FOUND'
        );
      }

      await this.repo.delete(id, tenantId);

      logger.info('✅ Inquilino deletado com sucesso', {
        id,
        tenantId,
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error('❌ Erro ao deletar inquilino', error as Error, {
        id,
        tenantId,
      });

      throw new AppError(
        'Erro ao deletar inquilino',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'DELETE_ERROR'
      );
    }
  }

  /**
   * ======================================================
   * 📊 GET STATS - Obter estatísticas
   * ======================================================
   * 
   * @param tenantId - ID do tenant
   * @returns Objeto com estatísticas
   */
  async getStats(tenantId: string): Promise<{ total: number }> {
    try {
      logger.debug('📊 Obtendo estatísticas', {
        tenantId,
      });

      const total = (await this.repo.count?.(tenantId)) || 0;

      logger.info('✅ Estatísticas obtidas com sucesso', {
        tenantId,
        total,
      });

      return { total };
    } catch (error) {
      logger.error('❌ Erro ao obter estatísticas', error as Error, {
        tenantId,
      });

      throw new AppError(
        'Erro ao obter estatísticas',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'STATS_ERROR'
      );
    }
  }

  /**
   * ======================================================
   * 🔍 FIND BY EMAIL - Buscar inquilino por email
   * ======================================================
   * 
   * @param email - Email do inquilino
   * @param tenantId - ID do tenant
   * @returns Tenant ou null
   */
  async findByEmail(email: string, tenantId: string): Promise<Tenant | null> {
    try {
      logger.debug('🔍 Buscando inquilino por email', {
        email,
        tenantId,
      });

      const tenant = await this.repo.findByEmail?.(email, tenantId);

      if (!tenant) {
        logger.debug('Inquilino não encontrado por email', {
          email,
          tenantId,
        });
        return null;
      }

      return tenant;
    } catch (error) {
      logger.error('❌ Erro ao buscar inquilino por email', error as Error, {
        email,
        tenantId,
      });

      throw new AppError(
        'Erro ao buscar inquilino',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'FIND_ERROR'
      );
    }
  }

  /**
   * ======================================================
   * 🔍 FIND BY CPF - Buscar inquilino por CPF
   * ======================================================
   * 
   * @param cpf - CPF do inquilino
   * @param tenantId - ID do tenant
   * @returns Tenant ou null
   */
  async findByCPF(cpf: string, tenantId: string): Promise<Tenant | null> {
    try {
      logger.debug('🔍 Buscando inquilino por CPF', {
        cpf,
        tenantId,
      });

      const tenant = await this.repo.findByCPF?.(cpf, tenantId);

      if (!tenant) {
        logger.debug('Inquilino não encontrado por CPF', {
          cpf,
          tenantId,
        });
        return null;
      }

      return tenant;
    } catch (error) {
      logger.error('❌ Erro ao buscar inquilino por CPF', error as Error, {
        cpf,
        tenantId,
      });

      throw new AppError(
        'Erro ao buscar inquilino',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'FIND_ERROR'
      );
    }
  }
}