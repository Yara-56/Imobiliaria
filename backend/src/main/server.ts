// CAMINHO: backend/src/main/server.ts

import { app } from "./app.js";
import { env } from "../config/env.js";
import { connectDatabase, prisma } from "../config/database.config.js";
import { logger } from "../shared/utils/logger.js";

/**
 * 🚀 Bootstrap da aplicação
 */
async function startServer(): Promise<void> {
  try {
    // 1️⃣ Conecta no banco antes de iniciar o servidor
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(
        `🚀 Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`
      );
    });

    /**
     * 🛑 Graceful Shutdown
     * Fecha conexões corretamente ao encerrar a aplicação
     */
    const shutdown = async (signal: string) => {
      logger.warn(`⚠️ Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        await prisma.$disconnect();
        logger.info("🛑 Server closed successfully.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    logger.fatal({ err: error }, "💥 Failed to start server");
    process.exit(1);
  }
}

/**
 * 🚨 Captura de erros globais
 */
process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "💥 UNCAUGHT EXCEPTION");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "💥 UNHANDLED REJECTION");
  process.exit(1);
});

startServer();