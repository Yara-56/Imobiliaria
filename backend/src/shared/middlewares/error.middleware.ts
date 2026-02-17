import { Request, Response, NextFunction } from "express";
import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js";

// Função para formatar erros específicos do Mongoose (CastError, ValidationError)
const handleCastErrorDB = (err: any) => {
  const message = `Campo inválido: ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valor duplicado: ${value}. Por favor, use outro valor!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Dados inválidos. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Token inválido. Faça login novamente.", 401);

const handleJWTExpiredError = () => new AppError("Sua sessão expirou. Por favor, entre de novo.", 401);

// Middleware Principal
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (env.nodeEnv === "development") {
    // No desenvolvimento, mostramos TUDO para facilitar o debug no seu VS Code
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Em produção, limpamos o erro para não expor a estrutura do banco
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    // Erros operacionais (AppError) mostram a mensagem real
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Erros de programação ou desconhecidos: não vaza detalhes pro cliente
      console.error("💥 ERRO CRÍTICO:", err);
      res.status(500).json({
        status: "error",
        message: "Algo deu muito errado na AuraImobi.",
      });
    }
  }
};