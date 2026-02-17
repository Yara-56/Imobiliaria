import { Request, Response, NextFunction } from "express";
import Tenant from "./tenant.model.ts";
import { AppError } from "../../shared/errors/AppError.ts";

export const listTenants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenants = await Tenant.find({ tenantId: req.user?.tenantId }).sort("-createdAt").lean();
    res.status(200).json({ status: "success", results: tenants.length, data: tenants });
  } catch (error) {
    next(new AppError("Erro ao listar inquilinos.", 500));
  }
};

export const getTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findOne({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!tenant) return next(new AppError("Inquilino não encontrado.", 404));
    res.status(200).json({ status: "success", data: tenant });
  } catch (error) {
    next(new AppError("Erro ao buscar detalhes.", 500));
  }
};

export const createTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const documents = files?.map(f => ({ name: f.originalname, url: `/uploads/tenants/${f.filename}` })) || [];

    const newTenant = await Tenant.create({
      ...req.body,
      documents,
      owner: req.user?.id,
      tenantId: req.user?.tenantId
    });

    res.status(201).json({ status: "success", data: newTenant });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// ✅ Adicionado para resolver o erro ts(2339)
export const updateTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await Tenant.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return next(new AppError("Inquilino não encontrado.", 404));
    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    next(new AppError("Erro ao atualizar.", 400));
  }
};

// ✅ Adicionado para completar o CRUD
export const deleteTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findOneAndDelete({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!tenant) return next(new AppError("Inquilino não encontrado.", 404));
    res.status(200).json({ status: "success", message: "Removido com sucesso." });
  } catch (error) {
    next(new AppError("Erro ao deletar.", 500));
  }
};