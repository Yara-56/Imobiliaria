import { prisma } from "../../../config/database.config.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";
import {
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "../schemas/property.schema.js";

type InputDocument = {
  id?: string;
  fileName?: string;
  originalName?: string;
  fileUrl?: string;
  storageKey?: string;
  mimeType?: string | null;
  size?: number | null;
  filename?: string;
  url?: string;
};

type UpdatePropertyWithExistingDocuments = UpdatePropertyInput & {
  existingDocuments?: Array<{ id?: string }>;
};

const normalizeDocuments = (documents?: InputDocument[]) => {
  if (!documents || documents.length === 0) return undefined;

  const normalized = documents
    .map((doc) => {
      const fileName =
        doc.fileName?.trim() ||
        doc.filename?.trim() ||
        doc.originalName?.trim() ||
        "documento";

      const fileUrl = doc.fileUrl?.trim() || doc.url?.trim() || "";

      // ✅ Apenas campos que existem no schema do Prisma
      return {
        fileName,
        fileUrl,
        mimeType: doc.mimeType ?? null,
        size: typeof doc.size === "number" ? doc.size : null,
      };
    })
    .filter((doc) => doc.fileUrl.length > 0);

  return normalized.length > 0 ? normalized : undefined;
};

export const PropertyService = {
  async createProperty(data: CreatePropertyInput, tenantId: string) {
    try {
      const documents = normalizeDocuments(data.documents);

      return await prisma.property.create({
        data: {
          name: data.name,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          street: data.street,
          neighborhood: data.neighborhood,
          number: data.number,
          sqls: data.sqls,
          status: data.status ?? "DISPONIVEL",
          tenantId,
          ...(documents
            ? {
                documents: {
                  create: documents.map((doc) => ({
                    fileName: doc.fileName,
                    fileUrl: doc.fileUrl,
                    mimeType: doc.mimeType ?? null,
                    size: doc.size ?? null,
                  })),
                },
              }
            : {}),
        },
        include: {
          documents: true,
        },
      });
    } catch (error: any) {
      throw new AppError({
        message: `Erro ao salvar imóvel no banco: ${error.message}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  },

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
        include: {
          documents: true,
        },
      }),
      prisma.property.count({
        where: { tenantId },
      }),
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

  async getPropertyById(id: string, tenantId: string) {
    const property = await prisma.property.findFirst({
      where: { id, tenantId },
      include: {
        documents: true,
      },
    });

    if (!property) {
      throw new AppError({
        message: "Imóvel não encontrado ou sem permissão.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return property;
  },

  async updateProperty(id: string, data: UpdatePropertyInput, tenantId: string) {
    try {
      const existingProperty = await prisma.property.findFirst({
        where: { id, tenantId },
        select: { id: true },
      });

      if (!existingProperty) {
        throw new AppError({
          message: "Imóvel não encontrado para edição.",
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      const payload = data as UpdatePropertyWithExistingDocuments;
      const newDocuments = normalizeDocuments(data.documents);

      const keepIds = Array.isArray(payload.existingDocuments)
        ? payload.existingDocuments
            .map((doc) => doc?.id)
            .filter((docId): docId is string => Boolean(docId))
        : [];

      const hasDocumentChanges =
        data.documents !== undefined ||
        payload.existingDocuments !== undefined;

      return await prisma.$transaction(async (tx) => {
        if (hasDocumentChanges) {
          await tx.propertyDocument.deleteMany({
            where:
              keepIds.length > 0
                ? { propertyId: id, id: { notIn: keepIds } }
                : { propertyId: id },
          });

          if (newDocuments && newDocuments.length > 0) {
            await tx.propertyDocument.createMany({
              data: newDocuments.map((doc) => ({
                // ✅ Campos explícitos — sem spread
                fileName: doc.fileName,
                fileUrl: doc.fileUrl,
                mimeType: doc.mimeType ?? null,
                size: doc.size ?? null,
                propertyId: id,
              })),
            });
          }
        }

        return await tx.property.update({
          where: { id },
          data: {
            name: data.name,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            street: data.street,
            neighborhood: data.neighborhood,
            number: data.number,
            sqls: data.sqls,
            status: data.status,
          },
          include: {
            documents: true,
          },
        });
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: `Erro ao atualizar imóvel: ${error.message}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  },

  async deleteProperty(id: string, tenantId: string) {
    try {
      const existingProperty = await prisma.property.findFirst({
        where: { id, tenantId },
        select: { id: true },
      });

      if (!existingProperty) {
        throw new AppError({
          message: "Imóvel não encontrado para exclusão.",
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      await prisma.$transaction([
        prisma.propertyDocument.deleteMany({
          where: { propertyId: id },
        }),
        prisma.property.deleteMany({
          where: { id, tenantId },
        }),
      ]);

      return true;
    } catch (error: any) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: `Erro ao excluir imóvel: ${error.message}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  },
};