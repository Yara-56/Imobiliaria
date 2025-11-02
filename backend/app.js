// app.js
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

// =====================================================
// ✅ CORS CONFIG COMPLETA
// =====================================================
const allowedOrigins = [
  'https://imobiliaria-frontend-76xsdlum1-yara-56s-projects.vercel.app', // frontend Vercel
];

// Permite localhost em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(/http:\/\/localhost:\d+/);
  console.log('Dev: Permitindo localhost');
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS não permitido para: ${origin}`);
      callback(new Error(`CORS não permitido para: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // 👈 adicionado aqui
  credentials: true,
  optionsSuccessStatus: 200,
};

// Aplica o CORS antes de tudo
app.use(cors(corsOptions));

// =====================================================
// MIDDLEWARES
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// UPLOAD DE ARQUIVOS
// =====================================================
export const upload = multer({ storage: multer.memoryStorage() });

// =====================================================
// ROTAS
// =====================================================
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

// =====================================================
// ROTA DE TESTE
// =====================================================
app.get('/api', (req, res) => {
  res.json({ message: 'Real Estate API is running successfully ✅' });
});

// =====================================================
// MIDDLEWARE GLOBAL DE ERROS
// =====================================================
app.use((err, req, res, next) => {
  console.error('💥 Erro Global:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
  });
});

export default app;
