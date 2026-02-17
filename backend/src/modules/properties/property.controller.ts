import { Request, Response, NextFunction } from "express";
import Property from "./property.model";
import { AppError } from "../../shared/errors/AppError";

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user?.id; 
    if (!ownerId) throw new AppError("Usuário não autenticado", 401);

    // Criando o imóvel com a estrutura completa (incluindo address)
    const property = await Property.create({ 
      ...req.body, 
      owner: ownerId 
    });

    res.status(201).json({ 
      status: "success", 
      data: property 
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find({ owner: ownerId }).skip(skip).limit(limit).sort("-createdAt"),
      Property.countDocuments({ owner: ownerId })
    ]);

    res.status(200).json({ 
      status: "success", 
      results: properties.length,
      total, 
      pages: Math.ceil(total / limit),
      data: properties 
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      owner: req.user?.id 
    });

    if (!property) throw new AppError("Imóvel não encontrado", 404);

    res.status(200).json({ status: "success", data: property });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, owner: req.user?.id },
      req.body,
      { new: true, runValidators: true } // runValidators garante que o enum (Casa/Apto) seja respeitado
    );

    if (!property) throw new AppError("Imóvel não encontrado", 404);

    res.status(200).json({ status: "success", data: property });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user?.id 
    });

    if (!property) throw new AppError("Imóvel não encontrado", 404);

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};