import { injectable, inject } from "tsyringe";
import type { IPropertyRepository } from "../domain/repositories/IPropertyRepository.js";
import { PROPERTY_TOKENS } from "@modules/properties/tokens/property.tokens.js";
import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/infra/http/http-status.js";
import type {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../schemas/property.schema.js";

interface IFile {
  path: string;
}

@injectable()
export class PropertyService {
  constructor(
    @inject(PROPERTY_TOKENS.Repository)
    private readonly repository: IPropertyRepository
  ) {}

  async getById(id: string, tenantId: string) {
    const property = await this.repository.findById(id, tenantId);

    if (!property) {
      throw new AppError({
        message:
          "Imóvel não encontrado ou você não tem permissão para acessá-lo.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return property;
  }

  async create(
    data: CreatePropertyInput & { tenantId: string; userId: string },
    file?: IFile
  ) {
    const address = data.address;

    const payload = {
      title: data.title,
      description: data.description ?? null,

      // ✅ address como string (compatível com repository)
      address: `${address.street}, ${address.number}, ${address.neighborhood}`,

      city: address.city,
      state: address.state,
      zipCode: address.zipCode ?? null,

      // ✅ CORREÇÃO AQUI (usa price)
      rentValue: data.price,

      documentUrl: file?.path ?? null,

      tenantId: data.tenantId,
      userId: data.userId ?? null,
    };

    return this.repository.create(payload);
  }

  async listAll(tenantId: string, filters: any = {}) {
    return this.repository.findAll(tenantId, filters);
  }

  async update(
    id: string,
    tenantId: string,
    data: UpdatePropertyInput,
    file?: IFile
  ) {
    await this.getById(id, tenantId);

    const address = data.address;

    const payload = {
      ...data,

      address: address
        ? `${address.street}, ${address.number}, ${address.neighborhood}`
        : undefined,

      city: address?.city,
      state: address?.state,
      zipCode: address?.zipCode,

      // ✅ só atualiza se vier price
      ...(data.price !== undefined && { rentValue: data.price }),

      documentUrl: file?.path,
    };

    return this.repository.update(id, tenantId, payload);
  }

  async delete(id: string, tenantId: string) {
    await this.getById(id, tenantId);
    return this.repository.delete(id, tenantId);
  }
}