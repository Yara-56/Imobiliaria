// server.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

// =====================================================
// TRATAMENTO GLOBAL DE ERROS
// =====================================================
process.on('uncaughtException', (error) => {
  console.error('--- ERRO NÃO CAPTURADO ---');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('--- REJEIÇÃO DE PROMISE NÃO TRATADA ---');
  console.error('Reason:', reason);
});

// =====================================================
// CARREGA VARIÁVEIS DE AMBIENTE
// =====================================================
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("ERRO FATAL: JWT_SECRET não definido no ambiente!");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("ERRO FATAL: MONGO_URI não definido no ambiente!");
  process.exit(1);
}

const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

// =====================================================
// INICIALIZA SERVIDOR E CONEXÃO COM MONGO
// =====================================================
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🟢 Conectado ao MongoDB com sucesso");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("🔴 ERRO AO INICIAR SERVIDOR:", error);
    process.exit(1);
  }
};

startServer();
