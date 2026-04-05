import { ContractTemplate as PrismaTemplate } from "@prisma/client";
import { ContractTemplateEntity } from "../../../domain/entities/contract-template.entity.js";

export class ContractTemplateMapper {
  static toDomain(raw: PrismaTemplate): ContractTemplateEntity {
    return ContractTemplateEntity.restore({
      id: raw.id,
      name: raw.name,
      content: raw.content,
      variables: raw.variables as string[], // Cast para garantir array de strings
      tenantId: raw.tenantId,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(template: ContractTemplateEntity) {
    // Usamos os getters da entidade que criamos anteriormente
    return {
      id: template.id,
      name: template.name,
      content: template.content,
      variables: template.variables,
      tenantId: template.tenantId,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}