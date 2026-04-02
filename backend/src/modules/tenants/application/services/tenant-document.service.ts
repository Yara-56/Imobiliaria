import { inject, injectable } from "tsyringe";
import { IFileStorage } from "../../../../shared/storage/file-storage.interface.js";
import { TenantDocument, DocumentType } from "../../domain/entities/tenant.entity.js";
import { ITenantRepository } from "../../domain/repositories/tenant.repository.interface.js";
import { TENANT_TOKENS } from "../../tokens/tenant.tokens.js";
import { AppError } from "../../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../../shared/errors/http-status.js";

@injectable()
export class TenantDocumentService {
  constructor(
    @inject(TENANT_TOKENS.Repository)
    private readonly tenantRepo: ITenantRepository,

    @inject("FileStorage")
    private readonly storage: IFileStorage
  ) {}

  async uploadMany(
    files: Express.Multer.File[],
    renterId: string,
    tenantId: string,
    types: DocumentType[]
  ) {
    if (!files.length) {
      throw new AppError({
        message: "Nenhum arquivo enviado",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const tenant = await this.tenantRepo.findById(renterId, tenantId);

    if (!tenant) {
      throw new AppError({
        message: "Inquilino não encontrado",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const uploadedDocs = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const type = types[i];

      const filename = `${tenantId}-${renterId}-${Date.now()}-${file.originalname}`;

      const fileUrl = await this.storage.upload(file.buffer, filename);

      const document = TenantDocument.create({
        renterId,
        tenantId,
        type,
        fileUrl,
        fileName: file.originalname,
        mimeType: file.mimetype,
      });

      tenant.addDocument(document);

      uploadedDocs.push(document);
    }

    tenant.validateRequiredDocuments();

    await this.tenantRepo.update(tenant);

    return uploadedDocs;
  }
}