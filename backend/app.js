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

// 👇👇👇 ESTA É A LINHA CORRIGIDA 👇👇👇
// Dizemos ao CORS para aceitar requisições APENAS do seu frontend
app.use(cors({
  origin: 'https://imobiliaria-frontend-bice.vercel.app'
}));
// 👆👆👆 FIM DA CORREÇÃO 👆👆👆

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