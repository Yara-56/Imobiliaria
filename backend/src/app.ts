import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";

// Rotas
import authRoutes from "./modules/auth/auth.routes.js";
import propertyRoutes from "./modules/properties/property.routes.js";

// Middlewares
import { errorHandler } from "./shared/middleware/error.middleware.js";
import { notFound } from "./shared/middleware/notFound.middleware.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Performance & Security
|--------------------------------------------------------------------------
*/
app.use(helmet());
app.use(compression() as RequestHandler); // Casting preventivo

// Resolvendo o conflito do Pino com casting para 'any' ou 'unknown'
app.use(pinoHttp({ logger: logger as any }));

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/
app.use(
  cors({
    origin: env.nodeEnv === "production" ? env.frontendUrl : true,
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body Parsers & Cookies
|--------------------------------------------------------------------------
*/
app.use(express.json({ limit: "10kb" }));

/** * ✅ SOLUÇÃO DEFINITIVA PARA O ERRO ts(2769):
 * Forçamos o retorno de cookieParser() como RequestHandler.
 * Isso elimina a ambiguidade de sobrecarga que causa o erro de 'PathParams'.
 */
app.use(cookieParser() as RequestHandler); 

/*
|--------------------------------------------------------------------------
| Rate Limit (Proteção contra abuso)
|--------------------------------------------------------------------------
*/
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter as RequestHandler);

/*
|--------------------------------------------------------------------------
| Rotas da API (v1)
|--------------------------------------------------------------------------
*/
const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/properties`, propertyRoutes);

// Health Check
app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
*/
app.use(notFound as RequestHandler);
app.use(errorHandler as unknown as express.ErrorRequestHandler);

export default app;