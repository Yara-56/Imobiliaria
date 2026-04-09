import "reflect-metadata"; // 1. Sempre o primeiro
import "../../api/src/shared/container/index.ts"; // 2. Registra os serviços ANTES de carregar o app
import "./bootstrap.js"; // 3. Carrega variáveis de ambiente

import { Server } from "node:http";
import { app } from "./shared/infra/http/app.js";
import { PrismaClient } from "@prisma/client";
import { logger } from "./shared/utils/logger.js";

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || "development";
const BASE_URL =
  ENV === "development"
    ? `http://localhost:${PORT}`
    : "https://api.homeflux.com";

let server: Server | null = null;

// 🚨 Captura de exceções fatais síncronas
process.on("uncaughtException", (err) => {
  if (logger) {
    logger.fatal({ err }, "💥 CRITICAL: UNCAUGHT EXCEPTION");
  } else {
    console.error("💥 CRITICAL: UNCAUGHT EXCEPTION", err);
  }
  process.exit(1);
});

/**
 * 🚀 Função principal de inicialização
 */
async function startServer(): Promise<void> {
  try {
    // 📡 Conexão com banco
    await prisma.$connect();
    logger?.info("📡 [HomeFlux] Database connected");

    // 🚀 Start do servidor
    server = app.listen(PORT, () => {
      logger?.info(`🚀 HomeFlux API Engine v1.0 [${ENV}]`);
      logger?.info(`🔗 Local: ${BASE_URL}`);
      logger?.info(`🩺 Health: ${BASE_URL}/api/v1/health`);
    });

    // ⚠️ Erros async não tratados (Promise Rejections)
    process.on("unhandledRejection", (reason) => {
      logger?.error({ reason }, "💥 ASYNC ERROR: UNHANDLED REJECTION");
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
 * 🛑 Graceful Shutdown (Desligamento suave)
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger?.warn(`⚠️ Shutdown initiated: ${signal}`);

  const closeServer = () =>
    new Promise<void>((resolve) => {
      if (!server) return resolve();
      server.close(() => resolve());
    });

  try {
    // Tenta fechar tudo em até 10 segundos
    await Promise.race([
      Promise.all([
        closeServer(),
        prisma.$disconnect()
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Shutdown Timeout")), 10000)
      ),
    ]);

    logger?.info("🛑 Clean exit. System offline.");
    process.exit(0);
  } catch (err) {
    logger?.error({ err }, "❌ Forced exit: Shutdown error or timeout");
    process.exit(1);
  }
}

// 🔌 Sinais de terminação do Sistema/Docker/PM2
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Inicia a aplicação
startServer();