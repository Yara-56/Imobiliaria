/**
 * AppError: Classe customizada para erros operacionais.
 * Melhorias: Tipagem forte, suporte a logging e segurança de stack traces.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    // Define se é uma falha de cliente (4xx) ou erro de servidor (5xx)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    
    // Marca o erro como operacional (erro previsto de negócio)
    // Erros não operacionais (bugs) devem ser tratados de forma diferente no logger.
    this.isOperational = true;

    // Remove a própria classe do Stack Trace para logs mais limpos no MacBook
    Error.captureStackTrace(this, this.constructor);
  }
}