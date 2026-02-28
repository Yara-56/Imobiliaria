import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../config/database.config.js"; // ✅ Prisma, não Mongoose
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

/**
 * 📄 LISTAR IMÓVEIS
 */
export const getAllProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const properties = await prisma.property.findMany({
      where: { tenantId: req.user.tenantId },
    });

    res.status(HttpStatus.OK).json({ data: properties });
  } catch (error) {
    next(error);
  }
};

/**
 * ➕ CRIAR IMÓVEL
 */
export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, address, price, status } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        address,
        price,
        status,
        tenantId: req.user.tenantId, // ✅ era req.user._id
      },
    });

    res.status(HttpStatus.CREATED).json({ data: property });
  } catch (error: any) {
    next(
      new AppError({
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      })
    );
  }
};

/**
 * 🔍 BUSCAR POR ID
 */
export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.user.tenantId,
      },
    });

    if (!property) {
      throw new AppError({
        message: "Imóvel não encontrado",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    res.status(HttpStatus.OK).json({ data: property });
  } catch (error) {
    next(error);
  }
};

/**
 * ✏️ ATUALIZAR IMÓVEL
 */
export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, address, price, status } = req.body;

    const property = await prisma.property.updateMany({
      where: {
        id: req.params.id,
        tenantId: req.user.tenantId,
      },
      data: { title, address, price, status },
    });

    if (property.count === 0) {
      throw new AppError({
        message: "Imóvel não encontrado",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    res.status(HttpStatus.OK).json({ data: property });
  } catch (error) {
    next(error);
  }
};

/**
 * 🗑️ DELETAR IMÓVEL
 */
export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await prisma.property.deleteMany({
      where: {
        id: req.params.id,
        tenantId: req.user.tenantId,
      },
    });

    if (deleted.count === 0) {
      throw new AppError({
        message: "Imóvel não encontrado",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};