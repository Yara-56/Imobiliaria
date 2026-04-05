import express, { Application } from "express";
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

// --- 📖 CONFIGURAÇÃO DO SWAGGER ---
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HomeFlux Enterprise API",
      version: "1.0.0",
      description: "Documentação oficial da API HomeFlux",
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3001}` }],
  },
  apis: ["./src/main/routes.ts", "./src/modules/**/infra/http/*.ts"], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

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
  env?.FRONTEND_URL,
  "http://localhost:5173",
  "http://192.168.2.170:5173"
];

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || env?.NODE_ENV === "development" || (origin && allowedOrigins.includes(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, 
  credentials: true 
}));

// --- 🚀 ROTAS E DOCUMENTAÇÃO ---
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api", apiRouter);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", env: env?.NODE_ENV || "development" });
});

app.use(errorMiddleware);