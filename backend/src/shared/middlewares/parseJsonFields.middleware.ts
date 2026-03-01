import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

/**
 * Parseia campos do req.body que podem chegar como JSON string
 * (muito comum em multipart/form-data).
 *
 * Ex: address = '{"street":"...","city":"..."}'
 */
export const parseJsonFields = (fields: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.body) return next();

      for (const field of fields) {
        const value = (req.body as any)[field];

        if (typeof value === "string") {
          if (value.trim().length === 0) continue;

          try {
            (req.body as any)[field] = JSON.parse(value);
          } catch {
            return next(
              new AppError(
                `Campo "${field}" deve ser um JSON válido (ex.: {"key":"value"}).`,
                400
              )
            );
          }
        }
      }

      return next();
    } catch (err: any) {
      return next(new AppError(err?.message || "Erro ao processar dados.", 400));
    }
  };
};
