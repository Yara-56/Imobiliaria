import { Request, Response, NextFunction } from "express";
// ✅ Em NodeNext, imports locais devem terminar em .js mesmo o arquivo sendo .ts
import Property from "../models/property.model.js"; 
import { AppError } from "@shared/errors/AppError.js"; // ✅ Usando o alias configurado

/**
 * 🏠 GET ALL: Lista apenas os imóveis do tenant logado
 */
export const getAllProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.tenantId;

    // ✅ Removido o 'as any': O Mongoose resolve a tipagem se o Model estiver correto
    const properties = await Property.find({ tenantId }).lean();

    res.status(200).json({
      status: "success",
      results: properties.length,
      data: { properties },
    });
  } catch (error: any) {
    next(new AppError(error.message || "Erro ao listar imóveis.", 400));
  }
};

/**
 * 🆕 CREATE: Instancia o modelo com tipagem forte
 */
export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.tenantId;
    const ownerId = req.user?.id;

    // ✅ Uso do spread operator com campos de auditoria controlados
    const property = await Property.create({
      ...req.body,
      tenantId,
      owner: ownerId,
    });

    res.status(201).json({
      status: "success",
      message: "Imóvel cadastrado com sucesso na AuraImobi!",
      data: property,
    });
  } catch (error: any) {
    next(new AppError(error.message || "Dados inválidos para o imóvel.", 400));
  }
};

/**
 * 🔍 GET BY ID: Busca segura filtrada por Tenant
 */
export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    }).lean();

    if (!property) {
      return next(new AppError("Imóvel não encontrado ou acesso negado.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 📝 UPDATE: Atualização com validação e retorno imediato
 */
export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!property) {
      return next(new AppError("Imóvel não encontrado para atualização.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🗑️ DELETE: Remoção segura
 */
export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!property) {
      return next(new AppError("Imóvel não encontrado para exclusão.", 404));
    }

    // Padrão REST: 204 No Content para deleções bem-sucedidas
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};