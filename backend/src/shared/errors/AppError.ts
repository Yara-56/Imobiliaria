import { HttpStatus, type HttpStatusCode } from "./http-status";
import { ErrorCodes, type ErrorCode } from "./error-codes";

interface AppErrorOptions {
  message: string;
  statusCode?: HttpStatusCode;
  errorCode?: ErrorCode;
  details?: unknown;
  isOperational?: boolean;
  cause?: unknown; // 🔥 novo (encadeamento de erro)
}

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorCode: ErrorCode;
  public readonly details?: unknown;
  public readonly isOperational: boolean;
  public readonly timestamp: string;
  public readonly cause?: unknown;

  constructor({
    message,
    statusCode = HttpStatus.BAD_REQUEST,
    errorCode = ErrorCodes.INTERNAL_ERROR,
    details,
    isOperational = true,
    cause,
  }: AppErrorOptions) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);

    // Evita erro em ambientes que não suportam
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // 🔥 SERIALIZAÇÃO PADRÃO (API RESPONSE)
  public toJSON() {
    return {
      status: "error",
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}