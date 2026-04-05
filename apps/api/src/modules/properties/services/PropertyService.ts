import { injectable, inject } from "tsyringe";
import { IPropertyRepository } from "../domain/repositories/IPropertyRepository.js";
import { PROPERTY_TOKENS } from "../tokens/property.tokens.js"; 
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";
import {
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "../schemas/property.schema.js";

interface IFile {
  path: string;
}

@injectable()
export class PropertyService {
  constructor(
    @inject(PROPERTY_TOKENS.Repository)
    private propertyRepository: IPropertyRepository
  ) {}

  /**
   * 🔍 BUSCAR POR ID (O CORAÇÃO DA VALIDAÇÃO)
   * Mudamos de 'getById' para 'findById' para resolver o erro ts(2339).
   */
  async findById(id: string, tenantId: string) {
    const property = await this.propertyRepository.findById(id, tenantId);
    
    if (!property) {
      throw new AppError({ 
        message: "Imóvel não encontrado ou você não tem permissão para acessá-lo.", 
        statusCode: HttpStatus.NOT_FOUND 
      });
    }
    
    return property;
  }

  /**
   * ➕ CRIAR IMÓVEL
   */
  async create(data: CreatePropertyInput & { tenantId: string; userId: string }, file?: IFile) {
    const { address, ...rest } = data;
    
    const payload = {
      ...rest,
      tenantId: data.tenantId,
      userId: data.userId,
      documentUrl: file ? file.path : undefined,
      city: address?.city || "", 
      state: address?.state || "",
      // Mapeamento inteligente: garante que o valor financeiro nunca seja nulo
      rentValue: (data as any).price || (data as any).rentValue || 0,
      address: address as any 
    };

    return await this.propertyRepository.create(payload);
  }

  /**
   * 📄 LISTAR TODOS (Scoped por Tenant)
   */
  async listAll(tenantId: string, filters: any = {}) {
    return await this.propertyRepository.findAll(tenantId, filters);
  }

  /**
   * 📝 ATUALIZAR IMÓVEL
   */
  async update(id: string, tenantId: string, data: UpdatePropertyInput, file?: IFile) {
    // 🛡️ Reutiliza o findById para garantir que o imóvel existe e é do dono certo
    await this.findById(id, tenantId);

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

  /**
   * 🗑️ DELETAR IMÓVEL
   */
  async delete(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return await this.propertyRepository.delete(id, tenantId);
  }
}