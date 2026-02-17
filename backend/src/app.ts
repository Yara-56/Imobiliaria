import express, { type Request, type Response, type ErrorRequestHandler } from "express";
import path from "node:path";
import crypto from "node:crypto";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";

// ✅ Extensões .ts explícitas para resolver ts(2834) e o erro de carregamento no Mac
import { env } from "./config/env.ts";
import { logger } from "./shared/utils/logger.ts";
// ✅ CORREÇÃO ts(1192): Usando importação nomeada com { } para sincronizar com seu index.ts
import { apiRouter } from "./shared/routes/index.ts";
import { errorHandler } from "./shared/middlewares/error.middleware.ts";
import { notFound } from "./shared/middlewares/notFound.middleware.ts";

const app = express();

/**
 * 🛡️ SEGURANÇA E PERFORMANCE
 */
app.use(helmet({ contentSecurityPolicy: env.nodeEnv === "production" }));
app.use(compression());
app.use(pinoHttp({ 
  logger: logger as any,
  genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID() 
}));

/**
 * 🌐 CORS (Configurado para o Frontend Vite da AuraImobi)
 */
app.use(cors({
  origin: [env.frontendUrl, "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id"] // Suporte para o isolamento da imobiliária
}));

/**
 * 🛠️ PARSERS E ARQUIVOS ESTÁTICOS
 */
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/**
 * 🚦 RATE LIMIT (Proteção contra brute force)
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Muitas requisições. Tente novamente em 15min." }
});
app.use("/api/", limiter);

/**
 * 🚀 ROTAS PRINCIPAIS
 */
app.use("/api/v1", apiRouter);

// Health Check para monitoramento
app.get("/health", (_req, res) => {
  res.status(200).json({ 
    status: "success", 
    timestamp: new Date().toISOString(),
    env: env.nodeEnv
  });
});

/**
 * 🛑 TRATAMENTO DE ERROS
 */
app.use(notFound);
app.use(errorHandler as unknown as ErrorRequestHandler);

export default app;