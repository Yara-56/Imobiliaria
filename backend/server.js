import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import winston from 'winston';

// Import de Rotas (vamos criar abaixo)
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// --- CONFIGURAÇÃO DE LOGS (Winston) ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// --- MIDDLEWARES GLOBAIS ---
app.use(cors({
  origin: 'http://localhost:5173', // URL do seu Vite
  credentials: true // Permite envio de cookies/headers de auth
}));
app.use(express.json()); // Body parser para JSON
app.use(cookieParser()); // Parser de cookies para o JWT seguro

// --- ROTAS ---
app.use('/api/v1/auth', authRoutes);

// Rota de Saúde (Health Check) - Padrão de mercado para monitoramento
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// --- TRATAMENTO DE ERROS GLOBAL ---
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Erro interno no servidor',
  });
});

// --- INICIALIZAÇÃO ---
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('✅ Conectado ao MongoDB com sucesso');
    app.listen(PORT, () => logger.info(`🚀 ImobiSys API rodando na porta ${PORT}`));
  })
  .catch((err) => {
    logger.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });