import dotenv from 'dotenv';
import connectDB from './src/config/db.js'; // <-- Importamos a conexão modular
import app from './src/app.js'; // <-- O app agora vem da pasta src

// =====================================================
// CARREGA VARIÁVEIS DE AMBIENTE
// =====================================================
dotenv.config();

// Validação Fail-Fast: O servidor nem liga se faltar o básico
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("🔴 ERRO FATAL: Variáveis de ambiente (JWT_SECRET ou MONGO_URI) não definidas.");
  process.exit(1);
}

const PORT = process.env.PORT || 5050;

// =====================================================
// TRATAMENTO GLOBAL DE ERROS (Safety Net)
// =====================================================
process.on('uncaughtException', (error) => {
  console.error('--- ERRO NÃO CAPTURADO (Uncaught Exception) ---');
  console.error(error);
  process.exit(1); // É mais seguro reiniciar o processo em caso de erro não tratado
});

process.on('unhandledRejection', (reason) => {
  console.error('--- PROMISE REJEITADA NÃO TRATADA ---');
  console.error(reason);
});

// =====================================================
// INICIALIZAÇÃO
// =====================================================
const startServer = async () => {
  try {
    // 1. Conecta ao Banco (Usando o módulo isolado)
    await connectDB();

    // 2. Sobe o Servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
      console.log(`🛡️  Modo: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error("🔴 Falha crítica na inicialização:", error);
    process.exit(1);
  }
};

startServer();