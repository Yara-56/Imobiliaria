import { AppError } from "../errors/AppError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    // Valida simultaneamente body, query e params
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Substitui pelos dados sanitizados (remove campos não mapeados no schema)
    req.body = validated.body;
    req.query = validated.query;
    req.params = validated.params;

    next();
  } catch (error) {
    // Formata os erros do Zod de forma amigável
    const message = error.errors
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(" | ");
    
    next(new AppError(`Falha na validação: ${message}`, 400));
  }
};