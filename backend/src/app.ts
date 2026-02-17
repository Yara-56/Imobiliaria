import express, { Request, Response, RequestHandler } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";

// ✅ Importação das Rotas (Sincronizadas com seu VS Code)
import authRoutes from "./modules/auth/auth.routes.js";
import propertyRoutes from "./modules/properties/property.routes.js";
import contractRoutes from "./modules/contracts/contract.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js"; // 🔥 Adicionado Financeiro

// Middlewares
import { errorHandler } from "./shared/middlewares/error.middleware.js";
import { notFound } from "./shared/middlewares/notFound.middleware.js";

const app = express();

/**
 * 🛡️ Camada de Segurança e Performance
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Permite carregar imagens/PDFs no front
}));
app.use(compression() as RequestHandler);
app.use(pinoHttp({ logger: logger as any }));

// ✅ CORS: Configurado para aceitar todas as portas comuns de desenvolvimento
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ Limite de Payload: Segurança contra ataques de negação de serviço (DoS)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser() as RequestHandler);

// ✅ Servindo arquivos estáticos: Essencial para sua avó abrir os PDFs no navegador
// No seu MacBook, isso aponta para a pasta /backend/uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/**
 * 🚦 Rate Limiting: Proteção de Cybersecurity
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: "Muitas requisições vindas deste IP, tente novamente em 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter as RequestHandler);

/*
|--------------------------------------------------------------------------
| 🚀 Rotas da API (v1)
|--------------------------------------------------------------------------
*/
const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/properties`, propertyRoutes);
app.use(`${API_PREFIX}/contracts`, contractRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes); // ✅ Módulo de Pagamentos Ativado

// Health Check: Monitoramento do servidor
app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

/**
 * 🛑 Tratamento de Erros Profissional
 */
app.use(notFound as RequestHandler);
app.use(errorHandler as unknown as express.ErrorRequestHandler);

export default app;