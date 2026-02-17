import "dotenv/config";
import { type Server } from "node:http";
import app from "./app.ts"; 
import { connectDatabase } from "./config/database.ts"; 
import { env } from "./config/env.ts";
import { logger } from "./shared/utils/logger.ts";

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
      logger.error({ err: reason instanceof Error ? reason : new Error(String(reason)) }, "💥 UNHANDLED REJECTION!");
      if (server) server.close(() => process.exit(1));
      else process.exit(1);
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.fatal({ err }, "❌ Falha crítica no bootstrap");
    process.exit(1);
  }
};

void startServer();

// 🔌 Encerramento Seguro (SIGINT/SIGTERM)
const shutdown = (signal: string) => {
  logger.info(`👋 Sinal ${signal} recebido.`);
  if (server) server.close(() => {
    logger.info("💤 Servidor encerrado.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));