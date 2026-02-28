import cors, { CorsOptions } from 'cors';

// 🌍 Lista de endereços que podem "falar" com o seu backend
const allowedOrigins = [
  'http://localhost:3000', // React padrão
  'http://localhost:5173', // Vite (provavelmente o seu)
  'http://127.0.0.1:5173'
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permite ferramentas de teste como Postman/Insomnia (que não mandam origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso negado pela política de CORS da Yara Enterprise.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // 🔐 Importante para o login funcionar depois!
};

export const corsMiddleware = cors(corsOptions);