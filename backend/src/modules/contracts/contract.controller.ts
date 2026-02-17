import { Request, Response, NextFunction } from "express";
import Contract from "./contract.model.js";
import { AppError } from "../../shared/errors/AppError.js";

// Listar todos os contratos do admin logado
export const listContracts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contracts = await Contract.find({ owner: req.user?.id })
      .populate("tenantId propertyId")
      .sort({ createdAt: -1 });
    res.status(200).json(contracts);
  } catch (error) {
    next(new AppError("Erro ao listar contratos.", 500));
  }
};

// Buscar um contrato específico por ID
export const getContractById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contract = await Contract.findOne({ 
      _id: req.params.id, 
      owner: req.user?.id 
    }).populate("tenantId propertyId");

    if (!contract) {
      return next(new AppError("Contrato não encontrado ou acesso negado.", 404));
    }
    res.status(200).json(contract);
  } catch (error) {
    next(new AppError("Erro ao buscar o contrato solicitado.", 500));
  }
};

// Criar novo contrato vinculado ao admin
export const createContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newContract = await Contract.create({ 
      ...req.body, 
      owner: req.user?.id 
    });
    res.status(201).json(newContract);
  } catch (error) {
    next(new AppError("Dados inválidos. Verifique os campos do contrato.", 400));
  }
};

// Atualizar contrato (Resolve o erro ts(2305))
export const updateContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await Contract.findOneAndUpdate(
      { _id: req.params.id, owner: req.user?.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return next(new AppError("Contrato não encontrado para atualização.", 404));
    }
    res.status(200).json(updated);
  } catch (error) {
    next(new AppError("Falha ao atualizar o contrato.", 400));
  }
};