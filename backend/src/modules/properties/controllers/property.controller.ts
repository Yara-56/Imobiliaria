import type { Request, Response, NextFunction } from "express";
import { PropertyService } from "../services/property.service.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

type UploadedFileLike = {
  originalname?: string;
  filename?: string;
  mimetype?: string;
  size?: number;
  path?: string;
};

const normalizeUploadedDocuments = (req: Request) => {
  const files = req.files;

  if (!files) return [];

  const mapFileToDocument = (file: UploadedFileLike) => {
    const savedFileName =
      file.filename?.trim() ||
      file.originalname?.trim() ||
      "documento";

    return {
      // ✅ Apenas campos que existem no schema do Prisma
      fileName: file.originalname?.trim() || savedFileName,
      fileUrl: `/uploads/properties/${savedFileName}`,
      mimeType: file.mimetype ?? null,
      size: typeof file.size === "number" ? file.size : null,
    };
  };

  if (Array.isArray(files)) {
    return files.map(mapFileToDocument);
  }

  if ("documents" in files && Array.isArray(files.documents)) {
    return files.documents.map(mapFileToDocument);
  }

  return [];
};

const normalizeBodyDocuments = (documents: unknown) => {
  if (!documents) return [];
  if (Array.isArray(documents)) return documents;

  if (typeof documents === "string") {
    try {
      const parsed = JSON.parse(documents);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const normalizeExistingDocuments = (existingDocuments: unknown) => {
  if (!existingDocuments) return undefined;

  if (typeof existingDocuments === "string") {
    try {
      const parsed = JSON.parse(existingDocuments);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }

  if (Array.isArray(existingDocuments)) return existingDocuments;

  return undefined;
};

export const getAllProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await PropertyService.getAllProperties(req.user.tenantId, {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    res.status(HttpStatus.OK).json({
      status: "success",
      results: result.properties.length,
      pagination: result.pagination,
      data: {
        properties: result.properties,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uploadedDocuments = normalizeUploadedDocuments(req);
    const bodyDocuments = normalizeBodyDocuments(req.body.documents);

    const property = await PropertyService.createProperty(
      {
        ...req.body,
        documents:
          uploadedDocuments.length > 0 ? uploadedDocuments : bodyDocuments,
      },
      req.user.tenantId
    );

    res.status(HttpStatus.CREATED).json({
      status: "success",
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await PropertyService.getPropertyById(
      id,
      req.user.tenantId
    );

    res.status(HttpStatus.OK).json({
      status: "success",
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const uploadedDocuments = normalizeUploadedDocuments(req);
    const bodyDocuments = normalizeBodyDocuments(req.body.documents);

    // ✅ Processa existingDocuments separadamente do body
    const existingDocuments = normalizeExistingDocuments(
      req.body.existingDocuments
    );

    const property = await PropertyService.updateProperty(
      id,
      {
        ...req.body,
        documents:
          uploadedDocuments.length > 0 ? uploadedDocuments : bodyDocuments,
        // ✅ Passa existingDocuments explicitamente
        existingDocuments,
      },
      req.user.tenantId
    );

    res.status(HttpStatus.OK).json({
      status: "success",
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await PropertyService.deleteProperty(id, req.user.tenantId);

    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};