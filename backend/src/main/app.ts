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

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(compression());
app.use(requestIdMiddleware);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Configuração do Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "ImobiSys API", version: "1.0.0", description: "SaaS de Gestão Imobiliária" },
    servers: [{ url: `http://localhost:${env.PORT}/api` }],
  },
  apis: ["./src/modules/**/*.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "imobisys-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRouter);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Importante: O errorMiddleware deve vir DEPOIS de todas as rotas
app.use(errorMiddleware);