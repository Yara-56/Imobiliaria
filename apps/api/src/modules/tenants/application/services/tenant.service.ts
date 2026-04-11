import { inject, injectable } from "tsyringe";
import type {
  ITenantRepository,
  CreateTenantData,
  PaginationQuery,
  PaginatedResult,
} from "../../domain/repositories/ITenantRepository.js";
import { Tenant } from "../../domain/entities/tenant.entity.js";
import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";
import { TENANT_TOKENS } from "../../tokens/tenant.tokens.js";
import { logger } from "@shared/utils/logger.js";

@injectable()
export class TenantService {
  constructor(
    @inject(TENANT_TOKENS.Repository)
    private readonly repo: ITenantRepository
  ) {}

  /**
   * ➕ CREATE (Cadastro de Inquilino com rastro de arquivo)
   */
  async create(data: CreateTenantData, file?: Express.Multer.File): Promise<Tenant> {
    try {
      // ✅ Logger: Contexto primeiro, mensagem depois (Padrão Pino/Winston)
      logger.info({ tenantId: data.tenantId, renter: data.fullName }, "📥 Iniciando criação de inquilino");

      // 🛡️ Validação de Unicidade Multi-tenant
      await this.ensureUniqueFields(data);

      // ✅ Instancia a Entidade usando a factory corrigida
      const tenant = Tenant.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        tenantId: data.tenantId,
        userId: data.userId,
        avatarUrl: file ? file.path : undefined,
      });

      const created = await this.repo.create(tenant);

      // ✅ Armazenamento no perfil: Vincula o arquivo como documento oficial
      if (file) {
        await this.repo.attachDocument(data.tenantId, created.id!, {
          name: "Documento de Identificação",
          url: file.path,
          category: "PERSONAL_DOC"
        });
      }

      logger.info({ renterId: created.id }, "✅ Inquilino criado com sucesso");

      return created;
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      logger.error({ error }, "❌ Falha crítica ao criar inquilino");

      throw new AppError({
        message: "Erro interno ao cadastrar inquilino no servidor",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  /**
   * 📄 FIND ALL (Paginação SaaS com metadados para o React)
   */
  async findAll(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Tenant>> {
    if (!tenantId) {
      throw new AppError({ 
        message: "O ID da imobiliária é obrigatório para listar inquilinos", 
        statusCode: HttpStatus.BAD_REQUEST 
      });
    }

    return await this.repo.findAll(tenantId, query);
  }

  /**
   * 🔎 FIND BY ID
   */
  async findById(id: string, tenantId: string): Promise<Tenant> {
    const tenant = await this.repo.findById(id, tenantId);

    if (!tenant) {
      throw new AppError({
        message: "Inquilino não encontrado nesta imobiliária.",
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
      });
    }

    return tenant;
  }

  /**
   * ✏️ UPDATE (Atualização controlada por domínio)
   */
  async update(id: string, tenantId: string, data: any, file?: Express.Multer.File): Promise<Tenant> {
    const tenant = await this.findById(id, tenantId);

    // 🔥 Atualizações via Métodos da Entidade (Garante consistência)
    if (data.fullName) tenant.updateFullName(data.fullName);
    if (data.email !== undefined) tenant.updateEmail(data.email);
    if (data.cpf !== undefined) tenant.updateCPF(data.cpf);
    if (data.phone !== undefined) tenant.updatePhone(data.phone);
    if (data.notes !== undefined) tenant.updateNotes(data.notes);
    
    if (file) {
      tenant.updateAvatar(file.path);
      await this.repo.attachDocument(tenantId, id, {
        name: "Identidade Atualizada",
        url: file.path,
        category: "PERSONAL_DOC"
      });
    }

    const updated = await this.repo.update(tenant);
    
    logger.info({ renterId: id }, "✏️ Dados do inquilino atualizados");
    
    return updated;
  }

  /**
   * 🗑️ DELETE
   */
  async delete(id: string, tenantId: string): Promise<void> {
    await this.findById(id, tenantId);
    await this.repo.delete(id, tenantId);
    
    logger.info({ renterId: id }, "🗑️ Inquilino removido do sistema");
  }

  /**
   * 🛡️ PRIVATE: Validação de unicidade (Isolado por Imobiliária)
   */
  private async ensureUniqueFields(data: CreateTenantData) {
    if (data.email) {
      const exists = await this.repo.findByEmail(data.email, data.tenantId);
      if (exists) {
        throw new AppError({ 
          message: "Este e-mail já pertence a outro inquilino cadastrado.", 
          statusCode: HttpStatus.CONFLICT 
        });
      }
    }

    if (data.cpf) {
      const exists = await this.repo.findByCPF(data.cpf, data.tenantId);
      if (exists) {
        throw new AppError({ 
          message: "Este CPF já consta no banco de dados desta imobiliária.", 
          statusCode: HttpStatus.CONFLICT 
        });
      }
    }
  }
}