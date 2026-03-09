import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { apiRouter } from "./routes.js";
import { errorMiddleware } from "../shared/middlewares/error.middleware.js"; 
import { requestIdMiddleware } from "../shared/middlewares/request-id.middleware.js";
import { env } from "../config/env.js";

/**
 * 🏗️ ImobiSys API - Professional SaaS Architecture
 * Clean Code & Cybersecurity Standards
 */
export const app: Application = express();

// --- 🛡️ SEGURANÇA E PERFORMANCE ---
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(morgan("dev"));

// --- ⚙️ MIDDLEWARES BASE ---
app.use(requestIdMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * 🔐 CONFIGURAÇÃO DE CORS PROFISSIONAL
 * Resolve o erro "Not allowed by CORS" detectando o ambiente.
 */
const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
];

app.use(cors({ 
  origin: (origin, callback) => {
    const isDevelopment = env.NODE_ENV === "development";
    
    // Em desenvolvimento, permite tudo que seja local para evitar travas no MacBook
    if (!origin || isDevelopment || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-request-id"]
}));

// --- 📚 DOCUMENTAÇÃO (SWAGGER) ---
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { 
      title: "ImobiSys API", 
      version: "1.0.0", 
      description: "SaaS de Gestão Imobiliária - Multi-tenant" 
    },
    servers: [{ url: `http://localhost:${env.PORT}/api/v1` }],
  },
  apis: ["./src/modules/**/*.ts"],
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- 🩺 MONITORAMENTO (HEALTH CHECK) ---
// Centralizado com o prefixo correto para bater com seus logs
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "imobisys-api",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV
  });
});

/**
 * 🚀 ROTAS DA API
 * O prefixo "/api" combina com o seu apiRouter que já injeta o "/v1".
 */
app.use("/api", apiRouter);

// --- 🚫 FALLBACK: 404 ---
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// --- 🚨 TRATAMENTO DE ERROS (Sempre por último) ---
app.use(errorMiddleware);