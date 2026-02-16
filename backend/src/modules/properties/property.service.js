import Property from "./property.model.js";
import { AppError } from "../../shared/errors/AppError.js";

export const createProperty = async (data, tenantId) => {
  // Garante que o objeto criado pertence ao tenant logado
  return Property.create({ ...data, tenantId });
};

export const getAllProperties = async (tenantId, filters = {}) => {
  const { page = 1, limit = 10 } = filters;
  
  // Paginação e filtro estrito por tenantId
  const properties = await Property.find({ tenantId })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Property.countDocuments({ tenantId });

  return { properties, total, pages: Math.ceil(total / limit), currentPage: page };
};

export const getPropertyById = async (id, tenantId) => {
  const property = await Property.findOne({ _id: id, tenantId });
  if (!property) throw new AppError("Imóvel não encontrado", 404);
  return property;
};

export const updateProperty = async (id, data, tenantId) => {
  // BLOQUEIO CRÍTICO: Remove o tenantId do data para impedir que o usuário
  // mude a propriedade de um cliente para outro via API.
  const { tenantId: discarded, ...updateData } = data;

  const property = await Property.findOneAndUpdate(
    { _id: id, tenantId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!property) throw new AppError("Imóvel não encontrado ou sem permissão", 404);
  return property;
};

export const deleteProperty = async (id, tenantId) => {
  const result = await Property.findOneAndDelete({ _id: id, tenantId });
  if (!result) throw new AppError("Imóvel não encontrado para exclusão", 404);
  return result;
};