import "reflect-metadata";
import { Server } from "node:http";
import { app } from "./shared/infra/http/app.js";
import { PrismaClient } from "@prisma/client";
import { logger } from "./shared/utils/logger.js";
import "./shared/container/index.js";

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || "development";
const BASE_URL =
  ENV === "development"
    ? `http://localhost:${PORT}`
    : `https://api.homeflux.com`;

let server: Server;

// 🚨 Captura de exceções fatais síncronas
process.on("uncaughtException", (err) => {
  if (logger) {
    logger.fatal({ err }, "💥 CRITICAL: UNCAUGHT EXCEPTION");
  } else {
    console.error("💥 CRITICAL: UNCAUGHT EXCEPTION", err);
  }
  process.exit(1);
});

async function startServer(): Promise<void> {
  try {
    // 📡 Conexão com banco
    await prisma.$connect();
    logger.info("📡 [HomeFlux] Database connected");

    // 🚀 Start do servidor
    server = app.listen(PORT, () => {
      logger.info(`🚀 HomeFlux API Engine v1.0 [${ENV}]`);
      logger.info(`🔗 Local: ${BASE_URL}`);
      logger.info(`🩺 Health: ${BASE_URL}/api/v1/health`);
    });

    // ⚠️ Erros async não tratados
    process.on("unhandledRejection", (reason) => {
      logger.error({ reason }, "💥 ASYNC ERROR: UNHANDLED REJECTION");
      gracefulShutdown("UNHANDLED_REJECTION");
    });

  } catch (err) {
    if (logger) {
      logger.fatal({ err }, "❌ FATAL: BOOTSTRAP FAILED");
    } else {
      console.error("❌ FATAL: BOOTSTRAP FAILED", err);
    }
    process.exit(1);
  }
}

/**
 * 🛑 Graceful Shutdown
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.warn(`⚠️ Shutdown initiated: ${signal}`);

  const closeServer = () =>
    new Promise<void>((resolve) => {
      if (!server) return resolve();
      server.close(() => resolve());
    });

  try {
    await Promise.race([
      Promise.all([closeServer(), prisma.$disconnect()]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Shutdown Timeout")), 10000)
      ),
    ]);

    logger.info("🛑 Clean exit. System offline.");
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "❌ Forced exit: Shutdown error or timeout");
    process.exit(1);
  }
}

// 🔌 Sinais do sistema
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();