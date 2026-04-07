import cors, { CorsOptions } from 'cors';

/**
 * 🌍 ALLOWED ORIGINS
 * Lista de endereços autorizados a consumir a API do HomeFlux.
 */
const allowedOrigins = [
  'http://localhost:3000',      // React (CRA)
  'http://localhost:5173',      // Vite (Padrão atual)
  'http://127.0.0.1:5173',      // Loopback Vite
  'https://homeflux.com.br',     // Produção
  'https://www.homeflux.com.br'
];

/**
 * ✅ CONFIGURAÇÃO DO CORS
 * Exportamos explicitamente para que o app.ts encontre o membro 'corsOptions'.
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origin (como Postman, Insomnia ou Mobile nativo)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso negado pela política de CORS da Yara Enterprise.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-tenant-id', 
    'x-request-id'
  ],
  credentials: true, // 🔐 Essencial para cookies e sessões multi-tenant
  optionsSuccessStatus: 200 // Correção para navegadores legados
};

/**
 * 📦 MIDDLEWARE PRONTO
 * Caso você prefira usar app.use(corsMiddleware) diretamente.
 */
export const corsMiddleware = cors(corsOptions);