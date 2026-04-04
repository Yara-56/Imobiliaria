import { PropertyRepository } from "../infrastructure/prima/repositories/PrismaPropertyRepository";
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";
import { UpdatePropertyInput } from "../schemas/property.schema.js";

export class UpdatePropertyService {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(
    id: string,
    tenantId: string,
    data: UpdatePropertyInput,
    file?: Express.Multer.File
  ) {
    const property = await this.propertyRepository.findById(id, tenantId);

    if (!property) {
      throw new AppError({
        message: "Imóvel não encontrado",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

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

    return this.propertyRepository.update(id, tenantId, updateData);
  }
}