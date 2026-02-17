import { Request, Response, NextFunction } from "express";
import { z, ZodError, type ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

export const validate = (schema: ZodSchema) => 
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validação assíncrona e higienização de dados
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { body: any; query: any; params: any };

      // Substituição pelos dados validados (proteção contra campos extras)
      req.body = validated.body;
      req.query = validated.query;
      req.params = validated.params;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue) => {
            const field = String(issue.path.length > 1 ? issue.path[1] : issue.path[0]);
            return `${field}: ${issue.message}`;
          })
          .join(" | ");

        return next(new AppError(message, 400));
      }
      next(error);
    }
  };