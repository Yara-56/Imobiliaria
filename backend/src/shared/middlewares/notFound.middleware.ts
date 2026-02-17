import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

/**
 * Middleware para capturar requisições em rotas inexistentes.
 * Em sistemas modernos, lançamos um AppError para que o errorHandler global
 * assuma o controle da resposta e mantenha o padrão de log.
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Não foi possível encontrar ${req.originalUrl} neste servidor.`, 404);
  next(error);
};