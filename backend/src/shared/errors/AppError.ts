import { HttpStatus, type HttpStatusCode } from "./http-status.js";
import { ErrorCodes, type ErrorCode } from "./error-codes.js";

interface AppErrorOptions {
  message: string;
  statusCode?: HttpStatusCode;
  errorCode?: ErrorCode;
  details?: unknown;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorCode: ErrorCode;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor({
    message,
    statusCode = HttpStatus.BAD_REQUEST,
    errorCode = ErrorCodes.INTERNAL_ERROR,
    details,
    isOperational = true,
  }: AppErrorOptions) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}