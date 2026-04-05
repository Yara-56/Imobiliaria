import "reflect-metadata"; // 🔥 OBRIGATÓRIO (PRIMEIRA LINHA)
import { Server } from "node:http";
import { app } from "./app"; // ✅ Agora ele é vizinho de pasta
import { prisma } from "../config/database.config"; // ✅ Ajustado para subir 1 nível até src e entrar em config
import { env } from "../config/env"; 
import { logger } from "../shared/utils/logger";

// 🔥 Injeção de Dependências
import "../shared/container";

let server: Server;

process.on("uncaughtException", (err: Error) => {
  logger.fatal({ err }, "💥 CRITICAL: UNCAUGHT EXCEPTION");
  process.exit(1);
});

async function startServer(): Promise<void> {
  try {
    logger.info("🔌 Starting professional bootstrap...");

    // 1. Conexão com o Banco (Prisma 7)
    await prisma.$connect();
    logger.info("✅ Database connected successfully");

    // 2. Inicialização do Servidor HTTP
    const port = env.PORT || 3001;
    server = app.listen(port, () => {
      const isDev = process.env.NODE_ENV === "development";
      const baseUrl = isDev ? `http://localhost:${port}` : `https://api.homeflux.com.br`;
      
      logger.info(`🚀 Server initialized in ${process.env.NODE_ENV} mode`);
      logger.info(`📡 Port: ${port}`);
      logger.info(`🩺 Health check: ${baseUrl}/health`);
    });

    process.on("unhandledRejection", (reason: unknown) => {
      const err = reason instanceof Error ? reason : new Error(String(reason));
      logger.error({ err }, "💥 ASYNC ERROR: UNHANDLED REJECTION");
      gracefulShutdown("UNHANDLED_REJECTION");
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.fatal({ err }, "❌ FATAL: FAILED TO START SERVER");
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string): Promise<void> {
  logger.warn(`⚠️ Shutdown signal received: ${signal}`);

  if (server) {
    server.close(async () => {
      logger.info("🛑 HTTP server closed.");
      try {
        await prisma.$disconnect();
        logger.info("🔌 Prisma disconnected.");
        process.exit(0);
      } catch (err) {
        logger.error({ err }, "❌ Error during database disconnection");
        process.exit(1);
      }
    });
    
    setTimeout(() => {
      logger.error("🔥 Forced shutdown due to timeout");
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();