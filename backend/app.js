import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import morgan from 'morgan';

// ================================
// ROTAS
// ================================
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

// ================================
// SEGURANÇA
// ================================
app.use(helmet());

// Limite global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // 300 req por IP
  standardHeaders: true,
  legacyHeaders: false,
}));

// Limite mais rígido para login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
});

// ================================
// CORS PROFISSIONAL
// ================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
];

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(/http:\/\/localhost:\d+/);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );

    if (allowed) return callback(null, true);

    return callback(new Error('CORS não permitido'));
  },
  credentials: true,
}));

// ================================
// MIDDLEWARES BASE
// ================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log HTTP (somente dev)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ================================
// UPLOAD
// ================================
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ================================
// ROTAS VERSIONADAS
// ================================
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/contracts', contractRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/receipts', receiptRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/debug', debugRoutes);

// ================================
// HEALTH CHECK (Cloud Ready)
// ================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
  });
});

// ================================
// 404 HANDLER
// ================================
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Rota não encontrada',
  });
});

// ================================
// ERROR HANDLER GLOBAL
// ================================
app.use((err, req, res, next) => {
  console.error('💥', err);

  res.status(err.status || 500).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Erro interno no servidor'
        : err.message,
  });
});

export default app;
