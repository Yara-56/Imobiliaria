import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function requestIdMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  req.requestId = randomUUID();
  next();
}

export const getRequestId = (req: Request): string =>
  req.requestId ?? "unknown";