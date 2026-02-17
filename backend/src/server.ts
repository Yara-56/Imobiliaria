import "dotenv/config";
import type { Server } from "node:http";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";

let server: Server;

// 🛑 Captura erros fatais síncronos
process.on("uncaughtException", (err: Error) => {
  logger.fatal({ err }, `💥 UNCAUGHT EXCEPTION: ${err.message}`);
  process.exit(1);
});

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      logger.info(`🚀 Engine rodando na porta ${env.port} [${env.nodeEnv}]`);
    });

    // 🛡️ Captura promessas rejeitadas não tratadas
    process.on("unhandledRejection", (reason: unknown) => {
      const err =
        reason instanceof Error
          ? reason
          : new Error(String(reason));

      logger.error({ err }, "💥 UNHANDLED REJECTION!");

      if (server) {
        server.close(() => process.exit(1));
      } else {
        process.exit(1);
      }
    });

  } catch (error: unknown) {
    const err =
      error instanceof Error
        ? error
        : new Error(String(error));

    logger.fatal({ err }, "❌ Falha crítica no bootstrap");
    process.exit(1);
  }
};

void startServer();

// 🔌 Graceful Shutdown
const shutdown = (signal: string): void => {
  logger.info(`👋 Sinal ${signal} recebido.`);

  if (server) {
    server.close(() => {
      logger.info("💤 Servidor encerrado com sucesso.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
