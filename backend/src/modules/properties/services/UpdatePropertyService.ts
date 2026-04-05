import { inject, injectable } from "tsyringe";
import { IPropertyRepository } from "../domain/repositories/IPropertyRepository";
import { PROPERTY_TOKENS } from "../tokens/property.tokens";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatus } from "../../../shared/errors/http-status";
import { UpdatePropertyInput } from "../schemas/property.schema";

@injectable()
export class UpdatePropertyService {
  constructor(
    @inject(PROPERTY_TOKENS.Repository)
    private propertyRepository: IPropertyRepository
  ) {}

  async execute(
    id: string,
    tenantId: string,
    data: UpdatePropertyInput,
    file?: Express.Multer.File
  ) {
    // 1. Verificação de Existência e Permissão (Segurança Multi-tenant)
    const property = await this.propertyRepository.findById(id, tenantId);

    if (!property) {
      throw new AppError({
        message: "Imóvel não encontrado ou acesso negado",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    // 2. Desestruturação Inteligente
    const { address: addressObj, ...rest } = data;

    /**
     * 🛠️ Formatação Profissional de Endereço
     * Aqui resolvemos o erro ts(2339). Em vez de buscar .address, 
     * montamos a string a partir dos campos street, number, etc.
     */
    let formattedAddress = undefined;
    if (addressObj) {
      formattedAddress = `${addressObj.street}, ${addressObj.number}${
        addressObj.complement ? ` - ${addressObj.complement}` : ""
      }, ${addressObj.neighborhood}`;
    }

    // 3. Preparação do payload para o Repositório (Data Mapping)
    const updateData = {
      ...rest,
      ...(file && { documentUrl: file.path }), // Cloudinary/S3 URL
      ...(addressObj && {
        city: addressObj.city,
        state: addressObj.state,
        zipCode: addressObj.zipCode,
        address: formattedAddress // ✅ Agora passamos a string correta
      })
    };

    // 4. Persistência
    return this.propertyRepository.update(id, tenantId, updateData);
  }
}