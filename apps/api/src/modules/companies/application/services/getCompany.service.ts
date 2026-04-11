import { inject, injectable } from "tsyringe";
import {
  COMPANY_REPOSITORY_TOKEN,
  type ICompanyRepository,
} from "../../domain/repositories/company.repository.js";

@injectable()
export class GetCompanyService {
  constructor(
    @inject(COMPANY_REPOSITORY_TOKEN)
    private companyRepository: ICompanyRepository
  ) {}

  async execute(id: string) {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new Error("Empresa não encontrada");
    }

    return company;
  }
}