import "reflect-metadata";
import { Server } from "node:http";
import { app } from "./app.js"; // Certifique-se que app.ts está na mesma pasta 'main'
import { prisma } from "../infrastructure/database/prisma.client.js";
import { logger } from "../shared/utils/logger.js";
import "../shared/container/index.js";

const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || "development";
const BASE_URL = ENV === "development" ? `http://localhost:${PORT}` : `https://api.homeflux.com`;

let server: Server;

// Captura de exceções fatais síncronas
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
    // 1. Conexão com o Banco de Dados (Prisma)
    await prisma.$connect();
    logger.info("📡 [HomeFlux] Database connected");

    // 2. Inicialização do Servidor Express
    server = app.listen(PORT, () => {
      logger.info(`🚀 HomeFlux API Engine v1.0 [${ENV}]`);
      logger.info(`🔗 Local: ${BASE_URL}`);
      logger.info(`🩺 Health: ${BASE_URL}/api/v1/health`);
    });

    // 3. Captura de Rejeições de Promises não tratadas
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
 * 🛑 Graceful Shutdown - Encerramento limpo de conexões
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.warn(`⚠️ Shutdown initiated: ${signal}`);

  const closeServer = () => new Promise<void>((resolve) => {
    if (!server) return resolve();
    server.close(() => resolve());
  });

  try {
    // Tenta fechar o servidor e o banco de dados em no máximo 10 segundos
    await Promise.race([
      Promise.all([closeServer(), prisma.$disconnect()]),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Shutdown Timeout")), 10000))
    ]);
    
    logger.info("🛑 Clean exit. System offline.");
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "❌ Forced exit: Shutdown error or timeout");
    process.exit(1);
  }
}

// Sinais de encerramento do Sistema Operacional
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();