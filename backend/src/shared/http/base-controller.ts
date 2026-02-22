import { Response, Request } from "express";
import { BaseResponse } from "./base-response.js";

export abstract class BaseController {
  protected ok<T>(
    res: Response,
    req: Request,
    data: T,
    message?: string
  ) {
    return res.status(200).json(
      BaseResponse.success(data, message, {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      })
    );
  }

  protected created<T>(
    res: Response,
    req: Request,
    data: T,
    message?: string
  ) {
    return res.status(201).json(
      BaseResponse.success(data, message, {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      })
    );
  }

  protected noContent(res: Response) {
    return res.status(204).send();
  }
}