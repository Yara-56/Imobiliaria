import { inject, injectable } from "tsyringe";
import {
  COMPANY_REPOSITORY_TOKEN,
  type ICompanyRepository,
} from "../../domain/repositories/company.repository.js";

type CreateCompanyRequest = {
  name: string;
  cnpj: string;
};

@injectable()
export class CreateCompanyService {
  constructor(
    @inject(COMPANY_REPOSITORY_TOKEN)
    private companyRepository: ICompanyRepository
  ) {}

  async execute({ name, cnpj }: CreateCompanyRequest) {
    const exists = await this.companyRepository.findByCNPJ(cnpj);

    if (exists) {
      throw new Error("Empresa já cadastrada");
    }

    return this.companyRepository.create({ name, cnpj });
  }
}
