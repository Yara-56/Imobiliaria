// backend/src/config/database.config.ts

import { PrismaClient } from "@prisma/client";
import { env } from "./env.js"; // Verifique se o caminho está certo (./env ou ./env.js)
import { logger } from "@shared/utils/logger.js";

declare global {
  var prisma: PrismaClient | undefined;
}

// Configuração de Logs Profissional
const prismaLogs: any[] = env.NODE_ENV === "development" 
  ? [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error'] 
  : ['error'];

export const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL, // 💡 O SEGREDO: Usar a URL que o Zod validou
    },
  },
  log: prismaLogs,
});

if (env.NODE_ENV !== "production") global.prisma = prisma;

// 🔌 Funções de Ciclo de Vida (Lifecycle)
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info("🍃 MongoDB conectado com sucesso via Prisma!");
  } catch (error) {
    logger.error({ err: error }, "❌ Falha ao conectar ao banco.");
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};