import { injectable, inject } from "tsyringe";
import { ICompanyRepository } from "../../domain/repositories/company.repository.js";
import { Company } from "../../domain/entities/company.entity.js";

type CreateCompanyDTO = {
  name: string;
  cnpj: string;
};

@injectable()
export class CreateCompanyService {
  constructor(
    @inject("CompanyRepository")
    private companyRepository: ICompanyRepository
  ) {}

  async execute({ name, cnpj }: CreateCompanyDTO): Promise<Company> {
    // =========================
    // NORMALIZAÇÃO
    // =========================
    const cleanCNPJ = cnpj.replace(/\D/g, "");

    // =========================
    // REGRA: NÃO DUPLICAR CNPJ
    // =========================
    const existingCompany = await this.companyRepository.findByCNPJ(cleanCNPJ);

    if (existingCompany) {
      throw new Error("Já existe uma empresa com esse CNPJ");
    }

    // =========================
    // CRIA ENTITY (DDD)
    // =========================
    const company = Company.create({
      name,
      cnpj: cleanCNPJ,
    });

    // =========================
    // PERSISTE
    // =========================
    const savedCompany = await this.companyRepository.create({
      name: company.name,
      cnpj: company.cnpj,
    });

    return savedCompany;
  }
}