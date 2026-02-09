// =====================================================
// CARREGA VARIÁVEIS DE AMBIENTE (TEM QUE SER PRIMEIRO)
// =====================================================
import dotenv from "dotenv";
dotenv.config();

// =====================================================
// IMPORTS PRINCIPAIS
// =====================================================
import app from "./app.js";
import connectDB from "./src/config/db.js";

// =====================================================
// FAIL FAST — NÃO SOBE SEM VARIÁVEIS IMPORTANTES
// =====================================================
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("🔴 ERRO FATAL: MONGO_URI ou JWT_SECRET não definidos no .env");
  process.exit(1);
}

const PORT = process.env.PORT || 5050;

// =====================================================
// SAFETY NET — ERROS GLOBAIS
// =====================================================
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:");
  console.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:");
  console.error(reason);
});

// =====================================================
// START SERVER
// =====================================================
const startServer = async () => {
  try {
    // Conecta no Mongo
    await connectDB();

    // Sobe Express
    app.listen(PORT, () => {
      console.log("=======================================");
      console.log(`🚀 Backend rodando: http://localhost:${PORT}`);
      console.log(`🛡️  Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log("=======================================");
    });

  } catch (error) {
    console.error("🔴 Falha crítica ao iniciar servidor:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
