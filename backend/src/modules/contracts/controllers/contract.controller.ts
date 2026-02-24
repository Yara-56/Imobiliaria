import { Request, Response, NextFunction } from "express";
import Contract from "../models/contract.model.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

// ✅ LISTAR CONTRATOS
export const listContracts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contracts = await Contract.find({
      tenantId: req.user.tenantId,
    }).lean();

    res.status(HttpStatus.OK).json({ data: contracts });
  } catch (error) {
    next(error);
  }
};

// ✅ CRIAR CONTRATO
export const createContract = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contract = await Contract.create({
      ...req.body,
      tenantId: req.user.tenantId,
    });

    res.status(HttpStatus.CREATED).json({ data: contract });
  } catch (error) {
    next(error);
  }
};

// ✅ BUSCAR POR ID
export const getContractById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    }).lean();

    res.status(HttpStatus.OK).json({ data: contract });
  } catch (error) {
    next(error);
  }
};

// ✅ ATUALIZAR CONTRATO
export const updateContract = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contract = await Contract.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );

    res.status(HttpStatus.OK).json({ data: contract });
  } catch (error) {
    next(error);
  }
};