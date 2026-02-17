import { Request, Response, NextFunction } from "express";
import Property from "./property.model.ts";
import { AppError } from "../../shared/errors/AppError.ts";

/**
 * 🏠 GET ALL: Lista apenas os imóveis do tenant logado
 */
export const getAllProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId;
    
    // ✅ Para evitar o erro ts(2349), tratamos o Model como 'any' ou garantimos o filtro simples
    const properties = await (Property as any).find({ tenantId });

    res.status(200).json({
      status: "success",
      results: properties.length,
      data: { properties }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

/**
 * 🆕 CREATE: Instancia o modelo para evitar conflito de tipos
 */
export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId;
    const ownerId = req.user?.id;

    // ✅ Resolve o erro ts(2349) instanciando o modelo individualmente
    const property = new Property({ 
      ...req.body, 
      tenantId, 
      owner: ownerId 
    });

    await property.save();

    res.status(201).json({ 
      status: "success", 
      message: "Imóvel cadastrado com sucesso na AuraImobi!",
      data: property 
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

/**
 * 🔍 GET BY ID: Busca segura filtrada por Tenant
 */
export const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ✅ Casting para 'any' resolve a união de assinaturas incompatíveis no findOne
    const property = await (Property as any).findOne({ 
      _id: req.params.id, 
      tenantId: req.tenantId 
    });

    if (!property) {
      return next(new AppError("Imóvel não encontrado ou acesso negado.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 📝 UPDATE: Atualização com validação
 */
export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await (Property as any).findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return next(new AppError("Imóvel não encontrado para atualização.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🗑️ DELETE
 */
export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await (Property as any).findOneAndDelete({ 
      _id: req.params.id, 
      tenantId: req.tenantId 
    });

    if (!property) {
      return next(new AppError("Imóvel não encontrado para exclusão.", 404));
    }

    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (error) {
    next(error);
  }
};