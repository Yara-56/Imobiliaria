import { DocumentType } from "../../domain/entities/tenant.entity.js";

export interface UploadTenantDocumentDTO {
  renterId: string;
  tenantId: string;
  type: DocumentType;
}