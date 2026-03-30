import { PropertyRepository } from "../infrastructure/repositories/PrismaPropertyRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";
import {
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "../schemas/property.schema.js";

export class PropertyService {
  constructor(private propertyRepository: PropertyRepository) {}

  async create(data: CreatePropertyInput & { tenantId: string; userId: string }, file?: any) {
    const { address, ...rest } = data;
    const payload = {
      ...rest,
      tenantId: data.tenantId,
      userId: data.userId,
      documentUrl: file ? file.path : undefined,
      city: address?.city || "", 
      state: address?.state || "",
      rentValue: data.price || 0,
      address: address as any 
    };
    return await this.propertyRepository.create(payload);
  }

  async listAll(tenantId: string, filters: any = {}) {
    return await this.propertyRepository.findAll(tenantId, filters);
  }

  async getById(id: string, tenantId: string) {
    const property = await this.propertyRepository.findById(id, tenantId);
    if (!property) throw new AppError({ message: "Imóvel não encontrado", statusCode: HttpStatus.NOT_FOUND });
    return property;
  }

  // ✅ ESTE É O MÉTODO QUE O CONTROLLER PROCURA
  async update(id: string, tenantId: string, data: UpdatePropertyInput, file?: any) {
    await this.getById(id, tenantId);
    const { address, ...rest } = data;
    const updateData = {
      ...rest,
      ...(file && { documentUrl: file.path }),
      ...(address && {
        city: address.city,
        state: address.state,
        address: address as any
      })
    };
    return await this.propertyRepository.update(id, tenantId, updateData);
  }

  async delete(id: string, tenantId: string) {
    await this.getById(id, tenantId);
    return await this.propertyRepository.delete(id, tenantId);
  }
}