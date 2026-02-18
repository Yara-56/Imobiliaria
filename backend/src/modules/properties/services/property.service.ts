// ✅ Removido o import Request, pois os dados já chegam limpos aqui
import Property from "../models/property.model.js"; 
import { AppError } from "@shared/errors/AppError.js";
import {
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "../schemas/property.schema.js";

/**
 * Camada de Serviço de Imóveis
 * Focada estritamente em Regra de Negócio e Banco de Dados.
 */
export const PropertyService = {
  /**
   * CRIAR IMÓVEL
   * Vincula automaticamente ao admin/tenant logado por segurança
   */
  async createProperty(data: CreatePropertyInput, ownerId: string) {
    return await Property.create({ ...data, owner: ownerId });
  },

  /**
   * LISTAR IMÓVEIS (Com Paginação)
   */
  async getAllProperties(
    ownerId: string,
    filters: { page?: number; limit?: number } = {}
  ) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 10);
    const query = { owner: ownerId };

    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean(), // ✅ Essencial para performance no React
      Property.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    };
  },

  /**
   * BUSCAR IMÓVEL POR ID
   */
  async getPropertyById(id: string, ownerId: string) {
    const property = await Property.findOne({ _id: id, owner: ownerId }).lean();
    
    if (!property) {
      throw new AppError("Imóvel não encontrado ou você não tem permissão.", 404);
    }
    
    return property;
  },

  /**
   * ATUALIZAR IMÓVEL
   */
  async updateProperty(
    id: string,
    data: UpdatePropertyInput,
    ownerId: string
  ) {
    const property = await Property.findOneAndUpdate(
      { _id: id, owner: ownerId },
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!property) {
      throw new AppError("Imóvel não encontrado para edição.", 404);
    }
    
    return property;
  },

  /**
   * DELETAR IMÓVEL
   */
  async deleteProperty(id: string, ownerId: string) {
    const result = await Property.findOneAndDelete({
      _id: id,
      owner: ownerId,
    });

    if (!result) {
      throw new AppError("Imóvel não encontrado para exclusão.", 404);
    }
    
    return result;
  }
};