// backend/server.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// ---> ADICIONADO: Listeners Globais de Erro <---
// Captura erros síncronos não tratados que podem derrubar o processo
process.on('uncaughtException', (error) => {
  console.error('--- ERRO NÃO CAPTURADO (uncaughtException) ---');
  console.error(error); // Imprime o erro completo
  // Em produção, seria ideal logar o erro em um serviço externo antes de sair
  process.exit(1); // Encerra o processo de forma controlada após um erro fatal
});

// Captura rejeições de Promises não tratadas (erros assíncronos)
process.on('unhandledRejection', (reason, promise) => {
  console.error('--- REJEIÇÃO DE PROMISE NÃO TRATADA (unhandledRejection) ---');
  console.error('Reason:', reason);
  // Pode logar 'promise' para mais detalhes, se necessário
  // Geralmente, não se encerra o processo aqui, mas é importante logar
});
// ---> FIM DO BLOCO ADICIONADO <---


// 1. Carrega as variáveis de ambiente PRIMEIRO que tudo!
dotenv.config();

// 2. AGORA importa o restante da aplicação
import app from './app.js'; 

// Verificação de segurança (Opcional, mas altamente recomendado)
if (!process.env.JWT_SECRET) {
  console.error("ERRO FATAL: JWT_SECRET não está definida no arquivo .env");
  process.exit(1); 
}

// Define a porta do servidor e a URL do MongoDB
// O Render injeta a variável PORT automaticamente. Usamos 5050 como fallback local.
const PORT = process.env.PORT || 5050; 
const MONGO_URI = process.env.MONGO_URI;

// Função principal para iniciar o servidor
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("ERRO FATAL: MONGO_URI não está definida no arquivo .env");
    }
    // Conecta ao MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("🟢 Conectado ao MongoDB com sucesso");

    // Inicia o servidor Express
    app.listen(PORT, () => {
      // Importante: No Render, a mensagem localhost não faz sentido.
      // Usamos 0.0.0.0 para indicar que está escutando em todas as interfaces.
      console.log(`🚀 Servidor rodando na porta ${PORT}`); 
    });
  } catch (error) {
    console.error("🔴 Erro ao conectar ao MongoDB ou iniciar o servidor:", error);
    process.exit(1); 
  }
};

// Chama a função para iniciar tudo
startServer();
