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

export const app: Application = express();

// --- 🛡️ SEGURANÇA E PERFORMANCE ---
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(morgan("dev"));

// --- ⚙️ MIDDLEWARES ---
app.use(requestIdMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --- 🔐 CORS DINÂMICO ---
const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.2.170:5173" // Adicionado o IP que apareceu nos seus logs
];

app.use(cors({ 
  origin: (origin, callback) => {
    // Em desenvolvimento, liberamos se não houver origin (ex: mobile) ou se estiver na lista
    if (!origin || env.NODE_ENV === "development" || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, 
  credentials: true 
}));

// --- 🚀 ROTAS ---
// O prefixo "/api" aqui faz com que o caminho final seja /api/v1/...
app.use("/api", apiRouter);

// Health Check profissional
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", env: env.NODE_ENV });
});

app.use(errorMiddleware);