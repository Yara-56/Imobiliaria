import { env } from "../../config/env.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erro interno do servidor";

  if (env.nodeEnv === "production" && !err.isOperational) {
    statusCode = 500;
    message = "Algo deu errado.";
  }

  res.status(statusCode).json({
    status: err.status || "error",
    message,
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};
