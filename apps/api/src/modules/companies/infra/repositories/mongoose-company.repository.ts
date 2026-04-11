import {
  ICompanyRepository,
  CreateCompanyData,
} from "../../domain/repositories/company.repository.js";
import { Company } from "../../domain/entities/company.entity.js";
import { CompanyModel } from "../company.model.js";

function toDomain(doc: {
  _id: unknown;
  name: string;
  cnpj: string;
  createdAt?: Date;
  updatedAt?: Date;
}): Company {
  return Company.create(
    {
      name: doc.name,
      cnpj: doc.cnpj,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    },
    String(doc._id)
  );
}

export class MongooseCompanyRepository implements ICompanyRepository {
  async create(data: CreateCompanyData): Promise<Company> {
    const company = await CompanyModel.create(data);
    return toDomain(company.toObject() as Parameters<typeof toDomain>[0]);
  }

  async findById(id: string): Promise<Company | null> {
    const company = await CompanyModel.findById(id);
    return company
      ? toDomain(company.toObject() as Parameters<typeof toDomain>[0])
      : null;
  }

  async findByCNPJ(cnpj: string): Promise<Company | null> {
    const company = await CompanyModel.findOne({ cnpj });
    return company
      ? toDomain(company.toObject() as Parameters<typeof toDomain>[0])
      : null;
  }

  async findAll(): Promise<Company[]> {
    const companies = await CompanyModel.find();
    return companies.map((c) =>
      toDomain(c.toObject() as Parameters<typeof toDomain>[0])
    );
  }

  async update(id: string, data: Record<string, unknown>): Promise<Company> {
    const company = await CompanyModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!company) throw new Error("Empresa não encontrada");

    return toDomain(company.toObject() as Parameters<typeof toDomain>[0]);
  }

  async delete(id: string): Promise<void> {
    await CompanyModel.findByIdAndDelete(id);
  }
}
