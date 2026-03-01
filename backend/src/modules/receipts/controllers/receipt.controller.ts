import { type Request, type Response, type NextFunction } from "express";
import Receipt from "../models/receipt.model.js"; // ✅ Extensão .js obrigatória para NodeNext
import { AppError } from "@shared/errors/AppError.js";

/**
 * 🧾 LISTAR RECIBOS
 * Usamos o 'req' para filtrar pelo dono logado, resolvendo o aviso ts(6133).
 */
export const listReceipts = async (
  req: Request, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    /**
     * 🛡️ Cybersecurity: Filtramos para que o admin veja apenas seus recibos.
     * Isso garante que 'req' seja lido e o aviso ts(6133) desapareça.
     */
    const receipts = await Receipt.find({ owner: req.user?.id })
      .populate("paymentId")
      .sort({ createdAt: -1 })
      .lean(); // ✅ Performance otimizada para o React

    res.status(200).json({
      status: "success",
      results: receipts.length,
      data: { receipts },
    });
  } catch (error: any) {
    next(new AppError("Falha ao buscar recibos.", 500));
  }
};

/**
 * 📝 CRIAR NOVO RECIBO
 */
export const createReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Vinculamos o recibo ao administrador que o está criando
    const receipt = await Receipt.create({
      ...req.body,
      owner: req.user?.id
    });

    res.status(201).json({
      status: "success",
      data: { receipt },
    });
  } catch (error: any) {
    next(new AppError("Falha ao criar o recibo. Verifique os dados enviados.", 400));
  }
};

/**
 * 🔍 BUSCAR RECIBO POR ID
 */
export const getReceiptById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Garantimos que o recibo pertença ao dono logado
    const receipt = await Receipt.findOne({ 
      _id: req.params.id, 
      owner: req.user?.id 
    })
      .populate("paymentId")
      .lean();

    if (!receipt) {
      return next(new AppError("Recibo não encontrado ou acesso negado.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { receipt },
    });
  } catch (error: any) {
    next(error);
  }
};