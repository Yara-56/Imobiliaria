import "dotenv/config";
import { Server } from "node:http";

import { app } from "./main/app.js";
import { connectDatabase } from "./config/database.config.js";
import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";

let server: Server;

/**
 * 🚨 CAPTURA ERROS SÍNCRONOS
 * (erros fora de promessas)
 */
process.on("uncaughtException", (err: Error) => {
  logger.fatal({ err }, "💥 UNCAUGHT EXCEPTION");
  process.exit(1);
});

/**
 * 🚀 BOOTSTRAP DO SERVIDOR
 */
async function startServer(): Promise<void> {
  try {
    logger.info("🔌 Connecting to database...");

    await connectDatabase();

    logger.info("✅ Database connected");

    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`📚 Swagger docs: http://localhost:${env.PORT}/docs`);
      logger.info(`🩺 Health check: http://localhost:${env.PORT}/api/v1/health`);
    });

    /**
     * 🚨 CAPTURA PROMISES NÃO TRATADAS
     */
    process.on("unhandledRejection", (reason: unknown) => {
      const err =
        reason instanceof Error ? reason : new Error(String(reason));

      logger.error({ err }, "💥 UNHANDLED REJECTION");

      shutdown("UNHANDLED_REJECTION");
    });

  } catch (error: unknown) {

    const err = error instanceof Error ? error : new Error(String(error));

    logger.fatal({ err }, "❌ FAILED TO START SERVER");

    process.exit(1);
  }
}

/**
 * 🛑 SHUTDOWN CONTROLADO
 */
function shutdown(signal: string): void {

  logger.warn(`⚠️ Shutdown signal received: ${signal}`);

  if (server) {
    server.close(() => {

      logger.info("🛑 HTTP server closed");

      process.exit(0);
    });

  } else {

    process.exit(0);
  }
}

/**
 * 📡 CAPTURA SINAIS DO SISTEMA
 */

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

/**
 * 🚀 START
 */
startServer();