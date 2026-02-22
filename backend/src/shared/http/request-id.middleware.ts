import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.requestId = uuid();
  res.setHeader("X-Request-Id", req.requestId);
  next();
};