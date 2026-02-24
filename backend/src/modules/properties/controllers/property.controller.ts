import { Request, Response, NextFunction } from "express";
import Property from "../models/property.model.js";
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
    const properties = await Property.find({
      tenantId: req.user.tenantId,
    }).lean();

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
    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
      tenantId: req.user.tenantId,
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
    const property = await Property.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    }).lean();

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
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: req.body },
      { new: true }
    ).lean();

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
 * 🗑️ DELETAR IMÓVEL
 */
export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!property) {
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