import { prisma } from "../../../config/database.config.js"; 
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";
import {
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "../schemas/property.schema.js";

export const PropertyService = {
  /**
   * ➕ CRIAR IMÓVEL
   * Correção: Garantindo que o objeto 'address' seja passado corretamente para o Prisma
   */
  async createProperty(data: CreatePropertyInput, tenantId: string) {
    try {
      return await prisma.property.create({
        data: {
          ...data,
          tenantId,
          // Se o seu Prisma pede 'address' como um campo JSON ou sub-objeto:
          address: data.address as any, 
        },
      });
    } catch (error: any) {
      throw new AppError({
        message: `Erro ao salvar no banco: ${error.message}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  },

  /**
   * 📄 LISTAR IMÓVEIS (Com Paginação)
   */
  async getAllProperties(
    tenantId: string,
    filters: { page?: number; limit?: number } = {}
  ) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 10);

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.property.count({ where: { tenantId } }),
    ]);

    return {
      properties,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  },

  /**
   * 🔍 BUSCAR POR ID
   */
  async getPropertyById(id: string, tenantId: string) {
    const property = await prisma.property.findFirst({
      where: { id, tenantId },
    });

    if (!property) {
      throw new AppError({
        message: "Imóvel não encontrado ou sem permissão.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return property;
  },

  /**
   * ✏️ ATUALIZAR IMÓVEL
   */
  async updateProperty(id: string, data: UpdatePropertyInput, tenantId: string) {
    // ⚠️ Importante: Removemos o tenantId do data para não tentar atualizar a chave de segurança
    const { ...updateFields } = data;

    const result = await prisma.property.updateMany({
      where: { id, tenantId },
      data: { 
        ...updateFields,
        address: updateFields.address ? (updateFields.address as any) : undefined 
      },
    });

    if (result.count === 0) {
      throw new AppError({
        message: "Imóvel não encontrado para edição.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return await this.getPropertyById(id, tenantId);
  },

  /**
   * 🗑️ DELETAR IMÓVEL
   */
  async deleteProperty(id: string, tenantId: string) {
    const result = await prisma.property.deleteMany({
      where: { id, tenantId },
    });

    if (result.count === 0) {
      throw new AppError({
        message: "Imóvel não encontrado para exclusão.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return true;
  },
};