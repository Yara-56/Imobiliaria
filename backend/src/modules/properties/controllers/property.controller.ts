import { Request, Response, NextFunction } from "express";
import Property from "../models/property.model.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

export const getAllProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Busca imóveis filtrando pelo tenantId da Imobiliária Lacerda
    const properties = await Property.find({ tenantId: req.user.tenantId }).lean();
    
    // ✅ Formato exato para o DashboardPage.tsx processar o .reduce()
    res.status(HttpStatus.OK).json({ data: properties });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
      tenantId: req.user.tenantId,
    });
    res.status(HttpStatus.CREATED).json({ data: property });
  } catch (error: any) {
    next(new AppError({ message: error.message, statusCode: HttpStatus.BAD_REQUEST }));
  }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: req.body },
      { new: true }
    ).lean();
    res.status(HttpStatus.OK).json({ data: property });
  } catch (error) { next(error); }
};