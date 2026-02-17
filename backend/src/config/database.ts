import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected) {
    console.log("⚡ MongoDB já está conectado.");
    return;
  }

  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv === "development",
      maxPoolSize: env.nodeEnv === "production" ? 20 : 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    console.log("🍃 MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("❌ Falha ao conectar ao MongoDB:");

    if (error instanceof Error) {
      console.error(error.message);
    }

    process.exit(1); // Fail-fast
  }
};

/* ==================================================
   🔁 LISTENERS GLOBAIS
================================================== */

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB conectado");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Erro no MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("🟡 MongoDB desconectado");
});

/* ==================================================
   🛑 GRACEFUL SHUTDOWN (PRODUÇÃO)
================================================== */

const gracefulShutdown = async (signal: string) => {
  console.log(`\n⚠️  Recebido ${signal}. Encerrando conexão MongoDB...`);

  try {
    await mongoose.connection.close();
    console.log("🔌 Conexão MongoDB encerrada com sucesso.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao encerrar conexão MongoDB:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export default connectDatabase;
