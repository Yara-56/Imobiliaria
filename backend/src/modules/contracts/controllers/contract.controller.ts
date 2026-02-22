import { Request, Response, NextFunction } from "express";
import Contract from "../models/contract.model.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

export const getAllContracts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contracts = await Contract.find({ tenantId: req.user.tenantId }).lean();
    
    // ✅ Sincronizado com o seu Dashboard
    res.status(HttpStatus.OK).json({ data: contracts });
  } catch (error) {
    next(error);
  }
};