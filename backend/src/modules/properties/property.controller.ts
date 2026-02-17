import { Request, Response, NextFunction } from "express";
import Property from "./property.model";
import { AppError } from "../../shared/errors/AppError";

// --- 1. LÓGICA DE NEGÓCIO (Internal Services) ---

const internalCreate = async (data: any, ownerId: string) => {
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

// --- 2. CONTROLLERS (Exports que o Router precisa) ---

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = (req as any).user._id; 
    const property = await internalCreate(req.body, ownerId);
    res.status(201).json({ status: "success", data: property });
  } catch (error) {
    next(error);
  }
};

export const getAllProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = (req as any).user._id;
    const result = await internalGetAll(ownerId, req.query);
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
};

// ✅ Adicionando a função que faltava para resolver o erro ts(2339)
export const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, owner: (req as any).user._id });
    if (!property) throw new AppError("Imóvel não encontrado", 404);
    res.status(200).json({ status: "success", data: property });
  } catch (error) {
    next(error);
  }
};

// ✅ Adicionando Update
export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, owner: (req as any).user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) throw new AppError("Imóvel não encontrado ou sem permissão", 404);
    res.status(200).json({ status: "success", data: property });
  } catch (error) {
    next(error);
  }
};

// ✅ Adicionando Delete
export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, owner: (req as any).user._id });
    if (!property) throw new AppError("Imóvel não encontrado", 404);
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};