import { app } from "./main/app.js"; // Importa o app com Swagger/Helmet
import { env } from "./config/env.js";
import { connectDatabase, prisma } from "./config/database.config.js";

/**
 * 🚀 Inicialização do Sistema
 */
async function bootstrap() {
  try {
    // 1️⃣ Conecta ao MongoDB via PRISMA (Não mais Mongoose)
    await connectDatabase();

    const PORT = env.PORT || 3001;

    // 2️⃣ Inicia o servidor usando as configurações do seu app.ts
    const server = app.listen(PORT, () => {
      console.log(`🚀 ImobiSys rodando em http://localhost:${PORT}`);
      console.log(`📖 Documentação: http://localhost:${PORT}/docs`);
    });

    /**
     * 🛑 Fechamento Limpo (Graceful Shutdown)
     */
    process.on("SIGINT", async () => {
      console.log("\n⚠️ Encerrando conexões...");
      await prisma.$disconnect();
      server.close(() => {
        console.log("🛑 Servidor finalizado com sucesso.");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Falha crítica na inicialização:", error);
    process.exit(1);
  }
}

bootstrap();