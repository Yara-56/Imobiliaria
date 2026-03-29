import { ICompanyRepository, CreateCompanyData } from "../../domain/repositories/company.repository.js";
import { Company } from "../../domain/entities/company.entity.js";
import { CompanyModel } from "../company.model.js";

export class MongooseCompanyRepository implements ICompanyRepository {
  async create(data: CreateCompanyData): Promise<Company> {
    const company = await CompanyModel.create(data);
    return company.toObject();
  }

  async findById(id: string): Promise<Company | null> {
    const company = await CompanyModel.findById(id);
    return company ? company.toObject() : null;
  }

  async findByCNPJ(cnpj: string): Promise<Company | null> {
    const company = await CompanyModel.findOne({ cnpj });
    return company ? company.toObject() : null;
  }

  async findAll(): Promise<Company[]> {
    const companies = await CompanyModel.find();
    return companies.map((c) => c.toObject());
  }

  async update(id: string, data: any): Promise<Company> {
    const company = await CompanyModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!company) throw new Error("Empresa não encontrada");

    return company.toObject();
  }

  async delete(id: string): Promise<void> {
    await CompanyModel.findByIdAndDelete(id);
  }
}