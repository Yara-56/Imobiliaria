import express, { type ErrorRequestHandler } from "express";
import path from "node:path";
import crypto from "node:crypto";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";
import { apiRouter } from "./shared/routes/index.js";
import { errorHandler } from "./shared/middlewares/error.middleware.js";
import { notFound } from "./shared/middlewares/notFound.middleware.js";

const app = express();

/* ==================================================
   🔐 SECURITY
================================================== */

app.use(
  helmet({
    contentSecurityPolicy: env.nodeEnv === "production",
  })
);

app.use(compression());

/* ==================================================
   📜 REQUEST LOGGER (com requestId)
================================================== */

app.use(
  pinoHttp({
    logger: logger as any,
    genReqId: () => crypto.randomUUID(),
  })
);

/* ==================================================
   🌍 CORS CONFIG (INTELIGENTE)
================================================== */

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origin (Postman, mobile apps, etc)
    if (!origin) return callback(null, true);

    // Em desenvolvimento permite qualquer localhost:517X
    if (
      env.nodeEnv === "development" &&
      origin.startsWith("http://localhost:517")
    ) {
      return callback(null, true);
    }

    // Em produção, use variável de ambiente
    if (env.nodeEnv === "production" && origin === env.frontendUrl) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

/* ==================================================
   📦 PARSERS
================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ==================================================
   📂 STATIC FILES
================================================== */

app.use("/uploads", express.static(path.resolve("uploads")));

/* ==================================================
   🚦 RATE LIMIT (apenas API)
================================================== */

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ==================================================
   🛣️ ROUTES
================================================== */

app.use("/api/v1", apiRouter);

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    env: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

/* ==================================================
   ❌ 404 + ERROR HANDLER
================================================== */

app.use(notFound);
app.use(errorHandler as ErrorRequestHandler);

export default app;
