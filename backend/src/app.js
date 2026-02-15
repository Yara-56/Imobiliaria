import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";

import authRoutes from "./modules/auth/auth.routes.js";
import propertyRoutes from "./modules/properties/property.routes.js";

import { errorHandler } from "./shared/middleware/error.middleware.js";
import { notFound } from "./shared/middleware/notFound.middleware.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Trust Proxy (IMPORTANTE EM PRODUÇÃO)
|--------------------------------------------------------------------------
*/
if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

/*
|--------------------------------------------------------------------------
| Logger HTTP
|--------------------------------------------------------------------------
*/
app.use(
  pinoHttp({
    logger,
  })
);

/*
|--------------------------------------------------------------------------
| Security Middlewares
|--------------------------------------------------------------------------
*/
app.use(helmet());

/*
|--------------------------------------------------------------------------
| Rate Limit (Proteção contra abuso)
|--------------------------------------------------------------------------
*/
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/
app.use(
  cors({
    origin: env.nodeEnv === "production"
      ? env.frontendUrl
      : "*",
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body & Cookies
|--------------------------------------------------------------------------
*/
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    environment: env.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/*
|--------------------------------------------------------------------------
| Base Route
|--------------------------------------------------------------------------
*/
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API rodando 🚀",
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/properties", propertyRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/
app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/
app.use(errorHandler);

export default app;
