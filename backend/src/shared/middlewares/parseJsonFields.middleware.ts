import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export const parseJsonFields = (fields: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.body) return next();

      for (const field of fields) {
        const value = (req.body as Record<string, unknown>)[field];

        if (typeof value === "string") {
          const trimmed = value.trim();
          if (!trimmed) continue;

          try {
            (req.body as Record<string, unknown>)[field] = JSON.parse(trimmed);
          } catch {
            return next(
              new AppError({
                message: `Campo "${field}" deve ser um JSON válido.`,
                statusCode: 400,
              })
            );
          }
        }

        if (Array.isArray(value)) {
          try {
            (req.body as Record<string, unknown>)[field] = value.map((item) => {
              if (typeof item !== "string") return item;
              const trimmed = item.trim();
              return trimmed ? JSON.parse(trimmed) : item;
            });
          } catch {
            return next(
              new AppError({
                message: `Campo "${field}" deve conter JSON válido.`,
                statusCode: 400,
              })
            );
          }
        }
      }

      return next();
    } catch (err: any) {
      return next(
        new AppError({
          message: err?.message || "Erro ao processar dados.",
          statusCode: 400,
        })
      );
    }
  };
};