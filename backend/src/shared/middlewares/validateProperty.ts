import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware genérico para validar qualquer schema do Zod
 */
export const validate = (schema: ZodSchema) => { // Alterado para ZodSchema
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // O parseAsync valida o objeto que passamos contra o schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          message: "Erro de validação nos dados enviados",
          // Formata os erros para o seu frontend em React
          errors: error.flatten().fieldErrors,
        });
      }
      
      return res.status(500).json({
        status: "error",
        message: "Erro interno ao validar dados",
      });
    }
  };
};