import { Company } from "../entities/company.entity.js";

export type CreateCompanyData = {
  name: string;
  cnpj: string;
};

export type UpdateCompanyData = Partial<CreateCompanyData>;

export interface ICompanyRepository {
  create(data: CreateCompanyData): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findByCNPJ(cnpj: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  update(id: string, data: UpdateCompanyData): Promise<Company>;
  delete(id: string): Promise<void>;
}

export const COMPANY_REPOSITORY_TOKEN = Symbol("ICompanyRepository");