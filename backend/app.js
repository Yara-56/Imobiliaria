// backend/app.js

import express from 'express';
import cors from 'cors';

// Importação das suas rotas
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import propertyRoutes from './routes/property.routes.js';
import contractRoutes from './routes/contract.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import receiptRoutes from './routes/receipt.routes.js';
import templateRoutes from './routes/template.routes.js';
import debugRoutes from './routes/debug.routes.js';

const app = express();

// --- CONFIGURAÇÃO DE CORS MELHORADA ---

// 1. Define as origens permitidas
const allowedOrigins = [
  'https://imobiliaria-frontend-bice.vercel.app' 
  // Adicione outras URLs de produção aqui se necessário
];

// 2. Em ambiente de desenvolvimento, permite localhost de qualquer porta
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(/http:\/\/localhost:\d+/);
  console.log('Ambiente de desenvolvimento: Permitindo origens localhost.');
}

// 3. Usa o middleware 'cors' com a lista de origens
// O pacote 'cors' sabe como lidar com um array de strings e Regex.
app.use(cors({
  origin: allowedOrigins,
  optionsSuccessStatus: 200 // Necessário para alguns navegadores antigos
}));

// --- FIM DO CORS ---


// Middlewares padrões
app.use(express.json());

// Definição das suas rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/debug', debugRoutes);

// Rota "raiz" da API para verificar se está online
app.get('/api', (req, res) => {
  res.send('Real Estate API is running successfully ✅');
});

export default app;