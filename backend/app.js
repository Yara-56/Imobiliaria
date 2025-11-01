// backend/app.js

import express from 'express';
import cors from 'cors';

// --- IMPORTS DAS ROTAS ---
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

// --- MIDDLEWARES GLOBAIS ---

// 👇👇👇 ESTA É A NOVA LÓGICA DE CORS 👇👇👇

// Lista de origens permitidas (APENAS produção)
const allowedOrigins = [
  'https://imobiliaria-frontend-bice.vercel.app' 
];

// Se NÃO estiver em produção (ou seja, local), permita qualquer localhost
if (process.env.NODE_ENV !== 'production') {
  // Isso usa uma "Expressão Regular" para permitir http://localhost: QUALQUER_PORTA
  allowedOrigins.push(/http:\/\/localhost:\d+/);
  console.log('Ambiente de desenvolvimento: Permitindo origens localhost.');
}

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (como Postman ou apps mobile)
    if (!origin) return callback(null, true);

    // Verifica se a 'origin' da requisição está na nossa lista de permitidos
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin; // Compara string
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin); // Testa a Regex
      }
      return false;
    });

    if (isAllowed) {
      return callback(null, true); // Permite a requisição
    } else {
      const msg = 'A política de CORS para este site não permite acesso da Origem especificada.';
      return callback(new Error(msg), false); // Bloqueia a requisição
    }
  }
}));
// 👆👆👆 FIM DA LÓGICA DE CORS 👆👆👆

app.use(express.json());

// --- REGISTRO DAS ROTAS ---
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

// --- ROTA DE TESTE ---
app.get('/api', (req, res) => {
  res.send('Real Estate API is running successfully ✅');
});

export default app;