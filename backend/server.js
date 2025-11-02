import mongoose from 'mongoose';
import dotenv from 'dotenv';

// --- Captura erros globais ---
process.on('uncaughtException', (error) => {
  console.error('--- ERRO NÃO CAPTURADO ---');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('--- REJEIÇÃO DE PROMISE NÃO TRATADA ---');
  console.error('Reason:', reason);
  // Não encerra o processo, mas é bom logar
});

// --- Carrega .env ---
dotenv.config();

import app from './app.js';

if (!process.env.JWT_SECRET) {
  console.error("ERRO FATAL: JWT_SECRET não definido no .env");
  process.exit(1);
}

const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

const startServer = async () => {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI não definido no .env");

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🟢 Conectado ao MongoDB com sucesso");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("🔴 Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
