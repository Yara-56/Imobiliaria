import express, { Application } from "express";
import path from "node:path";
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
  "http://192.168.2.170:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Em desenvolvimento, liberamos se não houver origin (ex.: mobile/postman)
      // ou se a origin estiver na lista permitida
      if (!origin || env.NODE_ENV === "development" || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// --- 📁 ARQUIVOS ESTÁTICOS (UPLOADS) ---
// Isso expõe a pasta backend/uploads em /uploads
// Ex.: http://localhost:5050/uploads/properties/arquivo.pdf
const uploadsDir = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// --- 🚀 ROTAS ---
app.use("/api", apiRouter);

// --- 🩺 HEALTH CHECK ---
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", env: env.NODE_ENV });
});

app.use(errorMiddleware);