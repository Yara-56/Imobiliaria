import { type Request, type Response, type NextFunction } from "express";

/** * ✅ No padrão NodeNext, os imports locais DEVEM terminar em .js.
 * O TypeScript resolverá para o arquivo .ts correspondente no disco.
 */
import { Tenant } from "../models/tenant.model.js"; 
import { AppError } from "@shared/errors/AppError.js";

/**
 * 👥 LISTAR INQUILINOS
 * Implementa Multi-tenancy: Filtra para que o admin veja apenas seus registros.
 */
export const listTenants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 🛡️ Cybersecurity: Busca filtrada pelo proprietário logado para isolamento de dados
    const tenants = await Tenant.find({ owner: req.user?.id })
      .sort({ createdAt: -1 })
      .lean(); 

    res.status(200).json({
      status: "success",
      results: tenants.length,
      data: { tenants },
    });
  } catch (error: any) {
    next(new AppError("Erro ao listar inquilinos.", 500));
  }
};

/**
 * 🔍 BUSCAR INQUILINO POR ID
 */
export const getTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = await Tenant.findOne({ 
      _id: req.params.id, 
      owner: req.user?.id 
    }).lean();

    if (!tenant) {
      return next(new AppError("Inquilino não encontrado.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { tenant },
    });
  } catch (error: any) {
    next(new AppError("Erro ao buscar inquilino.", 500));
  }
};

/**
 * ✨ CRIAR INQUILINO (Com Suporte a Documentos)
 */
export const createTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    // Mapeia os caminhos dos arquivos salvos pelo Multer para o banco de dados
    const documents =
      files?.map((file) => ({
        name: file.originalname,
        url: `/uploads/tenants/${file.filename}`,
      })) || [];

    const tenant = await Tenant.create({
      ...req.body,
      documents,
      owner: req.user?.id, 
    });

    res.status(201).json({
      status: "success",
      data: { tenant },
    });
  } catch (error: any) {
    next(new AppError(error?.message || "Erro ao criar inquilino.", 400));
  }
};

/**
 * 📝 ATUALIZAR INQUILINO
 */
export const updateTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const updateData: any = { ...req.body };

    if (files && files.length > 0) {
      updateData.documents = files.map((file) => ({
        name: file.originalname,
        url: `/uploads/tenants/${file.filename}`,
      }));
    }

    const updatedTenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user?.id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedTenant) {
      return next(new AppError("Inquilino não encontrado ou sem permissão.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { tenant: updatedTenant },
    });
  } catch (error: any) {
    next(new AppError("Erro ao atualizar inquilino.", 400));
  }
};

/**
 * 🗑️ DELETAR INQUILINO
 */
export const deleteTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await Tenant.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user?.id 
    });

    if (!deleted) {
      return next(new AppError("Inquilino não encontrado para exclusão.", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Inquilino removido com sucesso.",
    });
  } catch (error: any) {
    next(new AppError("Erro ao deletar inquilino.", 500));
  }
};