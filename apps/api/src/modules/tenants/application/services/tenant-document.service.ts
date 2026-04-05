import { inject, injectable } from "tsyringe";
import { IFileStorage } from "../../../../shared/storage/file-storage.interface.js";
import { TenantDocument, DocumentType } from "../../domain/entities/tenant.entity.js";
import { ITenantRepository } from "../../domain/repositories/ITenantRepository.js";
import { TENANT_TOKENS } from "../../tokens/tenant.tokens.js";
import { AppError } from "../../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";
import { logger } from "../../../../shared/utils/logger.js";

@injectable()
export class TenantDocumentService {
  constructor(
    @inject(TENANT_TOKENS.Repository)
    private readonly tenantRepo: ITenantRepository,

    @inject("FileStorage") // ⚠️ Certifique-se que este token está no shared/container
    private readonly storage: IFileStorage
  ) {}

  /**
   * 📤 UPLOAD DE MÚLTIPLOS DOCUMENTOS
   * Processa arquivos, faz upload para o Storage e vincula ao perfil do inquilino.
   */
  async uploadMany(
    files: Express.Multer.File[],
    renterId: string,
    tenantId: string,
    types: DocumentType[]
  ) {
    // 1. Validação defensiva inicial
    if (!files || files.length === 0) {
      throw new AppError({
        message: "Nenhum arquivo enviado para processamento.",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // 2. Busca o inquilino com isolamento Multi-tenant
    const tenant = await this.tenantRepo.findById(renterId, tenantId);

    if (!tenant) {
      logger.error({ renterId, tenantId }, "❌ Tentativa de upload para inquilino inexistente");
      throw new AppError({
        message: "Inquilino não encontrado no sistema.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const uploadedDocs: TenantDocument[] = [];

    try {
      logger.info({ count: files.length, renterId }, "📂 Iniciando processamento de documentos");

      // 3. Processamento em Loop (Poderia ser Promise.all para performance)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const type = types[i] || "OTHER"; // Fallback de segurança

        // Nome único para evitar sobrescrita no Storage (S3/Cloudinary/Local)
        const timestamp = Date.now();
        const cleanFileName = file.originalname.replace(/\s+/g, "_");
        const storageKey = `tenants/${tenantId}/${renterId}/${timestamp}-${cleanFileName}`;

        // Upload para o provedor de storage (usa buffer ou path dependendo da config)
        const fileUrl = await this.storage.upload(file.buffer || file.path, storageKey);

        // Instancia o Value Object do Documento
        const document = TenantDocument.create({
          renterId,
          tenantId,
          type,
          fileUrl,
          fileName: file.originalname,
          mimeType: file.mimetype,
        });

        // Vincula na Entidade (Método de domínio)
        tenant.addDocument(document);
        uploadedDocs.push(document);
      }

      // 4. Validação de Regra de Negócio (ex: verificar se enviou RG e CPF)
      if (tenant.validateRequiredDocuments) {
        tenant.validateRequiredDocuments();
      }

      // 5. Persistência final (Atomic update)
      await this.tenantRepo.update(tenant);

      logger.info({ renterId, docs: uploadedDocs.length }, "✅ Documentos anexados com sucesso");
      
      return uploadedDocs;

    } catch (error) {
      logger.error({ error }, "❌ Falha no processamento de arquivos");
      
      // 🚨 TODO: Implementar Rollback (deletar arquivos do storage se o banco falhar)
      
      throw new AppError({
        message: "Erro ao processar e salvar documentos.",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}