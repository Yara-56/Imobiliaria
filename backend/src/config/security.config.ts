import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./env.js";

/**
 * 🛡️ Middlewares de segurança da aplicação
 */
export const securityMiddlewares = [
  /**
   * Proteção de headers HTTP
   */
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),

  /**
   * Configuração de CORS
   */
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  }),

  /**
   * Proteção contra spam de requisições
   */
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.NODE_ENV === "development" ? 1000 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: "error",
      message: "Muitas requisições. Tente novamente em alguns minutos.",
    },
  }),
];

/**
 * 📦 Config exportado para o sistema de config global
 */
export const securityConfig = {
  middlewares: securityMiddlewares,
};