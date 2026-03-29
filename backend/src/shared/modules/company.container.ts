import { container } from "tsyringe";
import { TOKENS } from "../tokens";

// Interface
import { ICompanyRepository } from "@/modules/companies/domain/repositories/ICompanyRepository";

// Implementação
import { CompanyRepository } from "@/modules/companies/infra/repositories/CompanyRepository";

// 🔥 REGISTRO
container.registerSingleton<ICompanyRepository>(
  TOKENS.CompanyRepository,
  CompanyRepository
);