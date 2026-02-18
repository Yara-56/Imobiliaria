import { Request, Response, NextFunction } from "express";
import Contract from "../models/contract.model.js"; // ✅ Ajustado para a pasta correta
import { AppError } from "@shared/errors/AppError.js"; // ✅ Usando Alias profissional

/**
 * LISTAR TODOS OS CONTRATOS
 * Filtra automaticamente pelo proprietário logado
 */
export const listContracts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contracts = await Contract.find({ owner: req.user?.id })
      .populate("tenantId propertyId")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: "success",
      results: contracts.length,
      data: contracts
    });
  } catch (error) {
    next(new AppError("Erro ao listar contratos.", 500));
  }
};

/**
 * BUSCAR CONTRATO POR ID
 */
export const getContractById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      owner: req.user?.id,
    })
      .populate("tenantId propertyId")
      .lean();

    if (!contract) {
      return next(new AppError("Contrato não encontrado ou acesso negado.", 404));
    }

    res.status(200).json({
      status: "success",
      data: contract
    });
  } catch (error) {
    next(new AppError("Erro ao buscar o contrato solicitado.", 500));
  }
};

/**
 * CRIAR NOVO CONTRATO
 */
export const createContract = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newContract = await Contract.create({
      ...req.body,
      owner: req.user?.id,
    });

    res.status(201).json({
      status: "success",
      data: newContract
    });
  } catch (error) {
    next(new AppError("Dados inválidos. Verifique os campos do contrato.", 400));
  }
};

/**
 * ATUALIZAR CONTRATO
 */
export const updateContract = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await Contract.findOneAndUpdate(
      { _id: req.params.id, owner: req.user?.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return next(new AppError("Contrato não encontrado para atualização.", 404));
    }

    res.status(200).json({
      status: "success",
      data: updated
    });
  } catch (error) {
    next(new AppError("Falha ao atualizar o contrato.", 400));
  }
};