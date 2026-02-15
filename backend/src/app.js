import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import notFound from './middlewares/notFound.middleware.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);

app.get('/api/v1', (req, res) => {
  res.json({ message: 'API rodando 🚀' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
