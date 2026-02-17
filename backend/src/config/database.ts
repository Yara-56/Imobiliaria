import mongoose from "mongoose";
import { env } from "./env.js"; // ✅ SEMPRE .js em NodeNext

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv === "development",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("🍃 MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("❌ Falha ao conectar ao MongoDB:");

    if (error instanceof Error) {
      console.error(error.message);
    }

    process.exit(1);
  }
};

// 🔁 Listeners globais (produção-ready)
mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB conectado");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Erro no MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("🟡 MongoDB desconectado");
});

export default connectDatabase;
