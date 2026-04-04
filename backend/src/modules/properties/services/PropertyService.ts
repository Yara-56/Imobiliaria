import { injectable, inject } from "tsyringe";
import { IPropertyRepository } from "../domain/repositories/IPropertyRepository";
import { PROPERTY_TOKENS } from "../tokens/property.tokens"; // 🛠️ Corrigido de 'tonkens' para 'tokens'
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatus } from "../../../shared/errors/http-status";
import {
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "../schemas/property.schema";

/**
 * Interface auxiliar para o arquivo enviado via Multer/Cloudinary
 */
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
   * ➕ CRIAR IMÓVEL
   * Realiza o mapeamento do DTO para o formato aceito pelo repositório.
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
      // Mapeamento dinâmico: prioriza rentValue mas aceita price como fallback
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
   * 🔍 BUSCAR POR ID
   * @throws AppError se o imóvel não existir ou pertencer a outro tenant.
   */
  async getById(id: string, tenantId: string) {
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
   * 📝 ATUALIZAR IMÓVEL
   * Valida a existência antes de enviar os dados para o repositório.
   */
  async update(id: string, tenantId: string, data: UpdatePropertyInput, file?: IFile) {
    // 🛡️ Segurança: garante que o imóvel pertence ao tenant antes de editar
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

  /**
   * 🗑️ DELETAR IMÓVEL
   */
  async delete(id: string, tenantId: string) {
    await this.getById(id, tenantId);
    return await this.propertyRepository.delete(id, tenantId);
  }
}