import { Request, Response, NextFunction } from "express";
import { RequestContext } from "../context/request-context";

export const contextMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next();
  }

  RequestContext.run(
    {
      userId: req.user.id,
      tenantId: req.user.tenantId,
      role: req.user.role,
    },
    () => next()
  );
};