import { Request, Response, NextFunction } from "express";
import Tenant from "./tenant.model.ts";
import { AppError } from "../../shared/errors/AppError.ts";

/**
 * 📋 LISTAR: Filtra automaticamente pelo tenantId do usuário logado
 */
export const listTenants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenants = await Tenant.find({ tenantId: req.user?.tenantId })
      .sort("-createdAt")
      .lean();
    
    res.status(200).json({ status: "success", results: tenants.length, data: tenants });
  } catch (error) {
    next(new AppError("Erro ao listar inquilinos.", 500));
  }
};

/**
 * 🔍 BUSCAR: Detalhes de um único inquilino
 */
export const getTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findOne({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!tenant) return next(new AppError("Inquilino não encontrado.", 404));

    res.status(200).json({ status: "success", data: tenant });
  } catch (error) {
    next(new AppError("Erro ao buscar detalhes.", 500));
  }
};

/**
 * ➕ CRIAR: Processa os campos e os documentos do Multer
 */
export const createTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const documents = files?.map(f => ({ 
      name: f.originalname, 
      url: `/uploads/tenants/${f.filename}` 
    })) || [];

    const newTenant = await Tenant.create({
      ...req.body,
      documents,
      owner: req.user?.id,
      tenantId: req.user?.tenantId
    });

    res.status(201).json({ status: "success", data: newTenant });
  } catch (error: any) {
    next(new AppError(error.message || "Erro ao criar inquilino.", 400));
  }
};

/**
 * 🔄 ATUALIZAR: Permite novos uploads e atualiza dados
 */
export const updateTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedData = { ...req.body };
    
    // Se houver novos arquivos, tratamos aqui
    if (req.files && (req.files as any).length > 0) {
      const files = req.files as Express.Multer.File[];
      updatedData.documents = files.map(f => ({ 
        name: f.originalname, 
        url: `/uploads/tenants/${f.filename}` 
      }));
    }

    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!tenant) return next(new AppError("Inquilino não encontrado.", 404));

    res.status(200).json({ status: "success", data: tenant });
  } catch (error) {
    next(new AppError("Erro ao atualizar inquilino.", 400));
  }
};

/**
 * 🗑️ DELETAR: Remove o registro do banco
 */
export const deleteTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findOneAndDelete({ 
      _id: req.params.id, 
      tenantId: req.user?.tenantId 
    });

    if (!tenant) return next(new AppError("Inquilino não encontrado.", 404));

    res.status(200).json({ status: "success", message: "Inquilino removido com sucesso." });
  } catch (error) {
    next(new AppError("Erro ao deletar inquilino.", 500));
  }
};