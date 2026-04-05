import { ContractTemplateEntity } from "../entities/contract-template.entity.js";

export interface IContractTemplateRepository {
  findById(id: string, tenantId: string): Promise<ContractTemplateEntity | null>;
  findAll(tenantId: string): Promise<ContractTemplateEntity[]>;
  create(template: ContractTemplateEntity): Promise<void>;
}