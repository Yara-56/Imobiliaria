import { HttpStatus, type HttpStatusCode } from "./http-status.js";
import { ErrorCodes, type ErrorCode } from "./error-codes.js";

interface AppErrorOptions {
  message: string;
  statusCode?: HttpStatusCode;
  errorCode?: ErrorCode;
  details?: unknown;
  isOperational?: boolean;
  cause?: unknown;
}

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorCode: ErrorCode;
  public readonly details?: unknown;
  public readonly isOperational: boolean;
  public readonly timestamp: string;
  public readonly cause?: unknown;

  /**
   * Suporta dois formatos:
   * 1. new AppError({ message: "erro", statusCode: 400 })
   * 2. new AppError("mensagem de erro", 400) -> Para compatibilidade com seus middlewares
   */
  constructor(optionsOrMessage: AppErrorOptions | string, statusCodeOrErrorCode?: HttpStatusCode | ErrorCode) {
    let message: string;
    let statusCode: HttpStatusCode = HttpStatus.BAD_REQUEST;
    let errorCode: ErrorCode = ErrorCodes.INTERNAL_ERROR;
    let details: unknown = undefined;
    let isOperational = true;
    let cause: unknown = undefined;

    if (typeof optionsOrMessage === "string") {
      // Caso: new AppError("mensagem", 400)
      message = optionsOrMessage;
      if (typeof statusCodeOrErrorCode === "number") {
        statusCode = statusCodeOrErrorCode as HttpStatusCode;
      }
    } else {
      // Caso: new AppError({ message: "...", ... })
      message = optionsOrMessage.message;
      statusCode = optionsOrMessage.statusCode ?? HttpStatus.BAD_REQUEST;
      errorCode = optionsOrMessage.errorCode ?? ErrorCodes.INTERNAL_ERROR;
      details = optionsOrMessage.details;
      isOperational = optionsOrMessage.isOperational ?? true;
      cause = optionsOrMessage.cause;
    }

    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

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