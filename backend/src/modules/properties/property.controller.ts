import Property from "./property.model.js";
import { AppError } from "../../shared/errors/AppError.js";

export const createProperty = async (data: any, ownerId: string) => {
  return await Property.create({ ...data, owner: ownerId });
};

export const getAllProperties = async (ownerId: string, query: any) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Garante que o usuário só veja os PRÓPRIOS imóveis
  const [properties, total] = await Promise.all([
    Property.find({ owner: ownerId }).skip(skip).limit(limit).sort("-createdAt"),
    Property.countDocuments({ owner: ownerId })
  ]);

  return {
    properties,
    total,
    pages: Math.ceil(total / limit)
  };
};

export const getPropertyById = async (id: string, ownerId: string) => {
  const property = await Property.findOne({ _id: id, owner: ownerId });
  if (!property) throw new AppError("Imóvel não encontrado", 404);
  return property;
};

export const updateProperty = async (id: string, data: any, ownerId: string) => {
  const property = await Property.findOneAndUpdate(
    { _id: id, owner: ownerId },
    data,
    { new: true, runValidators: true }
  );
  if (!property) throw new AppError("Imóvel não encontrado ou sem permissão", 404);
  return property;
};

export const deleteProperty = async (id: string, ownerId: string) => {
  const property = await Property.findOneAndDelete({ _id: id, owner: ownerId });
  if (!property) throw new AppError("Imóvel não encontrado", 404);
  return true;
};