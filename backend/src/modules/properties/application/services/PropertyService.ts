import { Property } from '../../domain/entities/property.entity';
// ✅ Caminho corrigido para subir 2 níveis e encontrar a interface
import { 
  IPropertyRepository, 
  CreatePropertyData 
} from '../../domain/repositories/IPropertyRepository';

import { AppError } from '../../../../shared/errors/AppError';
import { HttpStatus } from '../../../../shared/errors/http-status';
import { ErrorCodes } from '../../../../shared/errors/error-codes';

export class PropertyService {
  constructor(private readonly repo: IPropertyRepository) {}

  /**
   * Cria um imóvel com validação de domínio e suporte a documentos (Escritura/PDF)
   */
  async create(data: CreatePropertyData, file?: Express.Multer.File): Promise<Property> {
    try {
      // 1. Prepara a URL do documento se um arquivo foi enviado
      const documentUrl = file ? `/uploads/properties/${file.filename}` : data.documentUrl;

      // 2. Instancia a Entidade (isso dispara as validações de CEP, UF, Título, etc.)
      const propertyEntity = new Property({
        ...data,
        rentValue: Number(data.rentValue), // Garante que é número (FormData envia como string)
        documentUrl: documentUrl ?? null
      });

      // 3. Persiste no banco de dados via Repositório
      return await this.repo.create(propertyEntity);
    } catch (error: any) {
      // Se for um erro que nós mesmos lançamos (AppError ou validação da Entity)
      if (error instanceof AppError) throw error;
      
      throw new AppError({
        message: error.message || "Erro interno ao processar criação do imóvel",
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR
      });
    }
  }

  /**
   * Busca um imóvel garantindo o isolamento entre empresas (Multi-tenancy)
   */
  async getById(id: string, tenantId: string): Promise<Property> {
    const property = await this.repo.findById(id, tenantId);

    if (!property) {
      throw new AppError({
        message: "Imóvel não encontrado ou você não tem permissão para acessá-lo",
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND
      });
    }

    return property;
  }

  /**
   * Lista todos os imóveis de um tenant com filtros e paginação
   */
  async listAll(tenantId: string, query: any): Promise<Property[]> {
    return await this.repo.findAll(tenantId, query);
  }

  /**
   * Remove um imóvel validando se ele pertence ao tenant
   */
  async delete(id: string, tenantId: string): Promise<void> {
    const property = await this.getById(id, tenantId); // Valida existência e tenant
    await this.repo.delete(property.id, tenantId);
  }
}