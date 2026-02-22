import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";
import { ErrorCodes } from "../errors/error-codes.js";

export const notFoundMiddleware: RequestHandler = (
  req,
  res,
  next
) => {
  next(
    new AppError({
      message: `Route ${req.originalUrl} not found`,
      statusCode: HttpStatus.NOT_FOUND,
      errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
    })
  );
};