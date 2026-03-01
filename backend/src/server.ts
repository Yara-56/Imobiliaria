// CAMINHO: backend/src/server.ts
import "dotenv/config";
import type { Server } from "node:http";

// CORREÇÃO 1: Caminho corrigido para a pasta 'main' e exportação desestruturada
// Conforme o erro ts(2613), o seu app.ts não usa 'export default', mas 'export const app'
import { app } from "./main/app.js"; 
import { connectDatabase } from "./config/database.config.js";
import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";

let server: Server;

// 🛑 Captura erros fatais síncronos (Essencial para Cybersecurity)
process.on("uncaughtException", (err: Error) => {
  logger.fatal({ err }, `💥 UNCAUGHT EXCEPTION: ${err.message}`);
  process.exit(1);
});

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    // CORREÇÃO 2: Acessando 'env.PORT' (em maiúsculo) conforme definido no seu config/env.ts
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Engine rodando na porta ${env.PORT} [${env.NODE_ENV}]`);
    });

    // 🛡️ Captura promessas rejeitadas não tratadas
    process.on("unhandledRejection", (reason: unknown) => {
      const err = reason instanceof Error ? reason : new Error(String(reason));

      logger.error({ err }, "💥 UNHANDLED REJECTION!");

      if (server) {
        server.close(() => process.exit(1));
      } else {
        process.exit(1);
      }
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));

    logger.fatal({ err }, "❌ Falha crítica no bootstrap");
    process.exit(1);
  }
};

void startServer();

// 🔌 Graceful Shutdown (Fechamento limpo para evitar corrupção de dados)
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