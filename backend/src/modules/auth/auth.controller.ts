import { Request, Response, NextFunction } from "express";
import Property from "./property.model";
import { AppError } from "../../shared/errors/AppError";

// --- 1. LÓGICA DE NEGÓCIO (Internal Services) ---
// Mantendo isolado para facilitar testes futuros no seu estágio

const internalCreate = async (data: any, ownerId: string) => {
  // O Mongoose vai validar o Schema que você definiu (address, type, status)
  return await Property.create({ ...data, owner: ownerId });
};

const internalGetAll = async (ownerId: string, query: any) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    Property.find({ owner: ownerId }).skip(skip).limit(limit).sort("-createdAt"),
    Property.countDocuments({ owner: ownerId })
  ]);

  return { properties, total, pages: Math.ceil(total / limit) };
};

// --- 2. CONTROLLERS ---

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Usando req.user.id injetado pelo seu middleware em shared/middlewares
    const ownerId = req.user?.id; 
    if (!ownerId) throw new AppError("Usuário não autenticado", 401);

    const property = await internalCreate(req.body, ownerId);
    
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
    if (!ownerId) throw new AppError("Usuário não autenticado", 401);

    const result = await internalGetAll(ownerId, req.query);
    
    res.status(200).json({ 
      status: "success", 
      results: result.properties.length,
      ...result 
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Garantindo que o usuário só veja imóveis que pertencem a ele (Segurança!)
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
      { 
        new: true, 
        runValidators: true // Importante para validar os enums de Status e Type
      }
    );

    if (!property) throw new AppError("Imóvel não encontrado ou sem permissão", 404);

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

    // Em DELETE, o padrão REST é 204 No Content
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};