import { ContractTemplateEntity } from "../../../domain/entities/contract-template.entity.js";

/** Registro persistível (sem model `ContractTemplate` no Prisma atual). */
export type ContractTemplateRecord = {
  id: string;
  name: string;
  content: string;
  variables: unknown;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class ContractTemplateMapper {
  static toDomain(raw: ContractTemplateRecord): ContractTemplateEntity {
    return ContractTemplateEntity.restore({
      id: raw.id,
      name: raw.name,
      content: raw.content,
      variables: raw.variables as string[],
      tenantId: raw.tenantId,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(template: ContractTemplateEntity) {
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
