import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../http/http-status.js";
import { BaseResponse } from "../http/base-response.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId: req.requestId,
  });

  const status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

  return res.status(status).json(
    BaseResponse.error(
      err.message || "Internal Server Error",
      {
        code: err.code,
        details: err.details,
      },
      {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      }
    )
  );
};