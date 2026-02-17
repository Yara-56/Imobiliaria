import Property from "./property.model.ts";
import { AppError } from "../../shared/errors/AppError.ts";
import { CreatePropertyInput, UpdatePropertyInput } from "./property.schema.ts";

export const createProperty = async (data: CreatePropertyInput, tenantId: string) => {
  // ✅ Resolvemos o erro ts(2349) instanciando manualmente se necessário, 
  // mas o .create costuma aceitar o casting para any no Model
  return await (Property as any).create({ ...data, tenantId });
};

export const getAllProperties = async (
  tenantId: string, 
  filters: { page?: number; limit?: number } = {}
) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const query = { tenantId };

  const [properties, total] = await Promise.all([
    (Property as any).find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean(),
    Property.countDocuments(query),
  ]);

  return { properties, total, pages: Math.ceil(total / limit), currentPage: page };
};

export const getPropertyById = async (id: string, tenantId: string) => {
  const property = await (Property as any).findOne({ _id: id, tenantId });
  if (!property) throw new AppError("Imóvel não encontrado", 404);
  return property;
};

export const updateProperty = async (id: string, data: UpdatePropertyInput, tenantId: string) => {
  const property = await (Property as any).findOneAndUpdate(
    { _id: id, tenantId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!property) throw new AppError("Imóvel não encontrado ou sem permissão para editar", 404);
  return property;
};

export const deleteProperty = async (id: string, tenantId: string) => {
  const result = await (Property as any).findOneAndDelete({ _id: id, tenantId });
  if (!result) throw new AppError("Imóvel não encontrado para exclusão", 404);
  return result;
};