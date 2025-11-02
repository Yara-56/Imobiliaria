// backend/app.js

import express from 'express';
import cors from 'cors';
import multer from 'multer';

// --- IMPORTAÇÃO DAS ROTAS ---
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

// --- CONFIGURAÇÃO DE CORS ---
const allowedOrigins = [
  'https://imobiliaria-frontend-bice.vercel.app', // Frontend em produção
];

// Permite localhost em dev
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(/http:\/\/localhost:\d+/);
  console.log('Dev: Permitindo localhost');
}

app.use(cors({
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
}));

// --- MIDDLEWARES ---
app.use(express.json()); // Suporta JSON no body
app.use(express.urlencoded({ extended: true })); // Suporta URL-encoded

// --- UPLOAD DE ARQUIVOS ---
export const upload = multer({ storage: multer.memoryStorage() });

// --- ROTAS ---
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

// --- TRATAMENTO DE ERROS GLOBAL ---
app.use((err, req, res, next) => {
  console.error('Erro Global:', err);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor' });
});

export default app;
