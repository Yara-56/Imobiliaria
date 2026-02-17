import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";

// Importação das Rotas
import authRoutes from "./modules/auth/auth.routes.js";
import propertyRoutes from "./modules/properties/property.routes.js";
import contractRoutes from "./modules/contracts/contract.routes.js"; // ✅ ADICIONADO

// Middlewares
import { errorHandler } from "./shared/middlewares/error.middleware.js";
import { notFound } from "./shared/middlewares/notFound.middleware.js";

const app = express();

app.use(helmet());
app.use(compression() as RequestHandler);
app.use(pinoHttp({ logger: logger as any }));

// CORS configurado para aceitar a porta 5174 do seu terminal
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser() as RequestHandler);

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
app.use(`${API_PREFIX}/contracts`, contractRoutes); // ✅ ROTA DE CONTRATOS ATIVADA

app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound as RequestHandler);
app.use(errorHandler as unknown as express.ErrorRequestHandler);

export default app;