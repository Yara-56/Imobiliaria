import express, { type ErrorRequestHandler } from "express";
import path from "node:path";
import crypto from "node:crypto";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";

import { env } from "./config/env";
import { logger } from "./shared/utils/logger";

// ✅ Agora o import nomeado funciona perfeitamente
import { apiRouter } from "./shared/routes/index"; 

import { errorHandler } from "./shared/middlewares/error.middleware";
import { notFound } from "./shared/middlewares/notFound.middleware";

const app = express();

app.use(helmet({ contentSecurityPolicy: env.nodeEnv === "production" }));
app.use(compression());
app.use(pinoHttp({ logger: logger as any, genReqId: () => crypto.randomUUID() }));

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

/* ======================================================
   ROTAS
====================================================== */
app.use("/api/v1", apiRouter);

app.get("/health", (_, res) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

app.use(notFound);
app.use(errorHandler as ErrorRequestHandler);

export default app;