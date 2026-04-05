import { PrismaClient } from "@prisma/client";
import { env, isDev } from "../../../config/env.js"; // Importando do seu Zod Schema

/**
 * 💡 DevOps Tip: 
 * Em produção, evitamos o log de 'query' para não expor dados sensíveis 
 * e não sobrecarregar os logs do Render/Cloudwatch.
 */
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL, // Garante que usa a URL validada pelo Zod
    },
  },
  log: isDev 
    ? ["query", "error", "warn"] 
    : ["error"], // Em produção, apenas erros críticos
});

/**
 * ⚡ Gerenciamento de Conexão (Graceful Shutdown)
 * Isso evita conexões "zumbis" no MongoDB Atlas quando o Render reinicia o app.
 */
export async function connectPrisma() {
  try {
    await prisma.$connect();
    if (isDev) console.log("🔌 MongoDB conectado com sucesso via Prisma!");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error);
    process.exit(1);
  }
}

export { prisma };