import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { apiRouter } from "./routes.js";
import { HttpStatus } from "../shared/errors/http-status.js";
import { AppError } from "../shared/errors/AppError.js";

const app: Application = express();

/**
 * 🌐 Trust proxy (necessário para SaaS em cloud)
 */
app.set("trust proxy", 1);

/**
 * 📚 Swagger Definition
 */
const specs = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ImobiSys API",
      version: "1.0.0",
      description: "SaaS de Gestão Imobiliária - Projeto Imobiliária Lacerda",
    },
    servers: [
      {
        url: "http://localhost:3001/api/v1",
      },
    ],
  },
  apis: ["./src/modules/**/*.ts", "./src/modules/**/*.js"],
});

/**
 * 🛡️ Security Middlewares
 */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/**
 * 🔓 CORS (production ready)
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * 📝 Logs
 */
app.use(morgan("dev"));

/**
 * 📦 Body parsers (com limite anti-abuso)
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * 📖 Docs
 */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * 🚀 API v1
 */
app.use("/api/v1", apiRouter);

/**
 * ❌ Rota não encontrada (MUITO IMPORTANTE)
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

/**
 * 🚨 Error Handler Centralizado
 */
app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
        errorCode: err.errorCode,
      });
    }

    console.error("🔥 INTERNAL ERROR:", err);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Erro interno no servidor do ImobiSys",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Contate o suporte",
    });
  }
);

export { app };