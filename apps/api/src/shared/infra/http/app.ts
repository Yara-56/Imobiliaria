import 'reflect-metadata'; // Necessário para o tsyringe (Injeção de Dependência)
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Importações usando a nova estrutura de pastas
import { env } from "@config/env";
import { corsOptions } from "@config/cors.config";
import { apiRouter } from "./routes";
import { errorMiddleware } from "../../middlewares/error.middleware"; 
import { requestIdMiddleware } from "../../middlewares/request-id.middleware";

// Inicializa o Container de Injeção de Dependência
import "@shared/container";

const app: Application = express();

/**
 * 📖 CONFIGURAÇÃO DO SWAGGER (Documentação Automática)
 */
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HomeFlux Enterprise API 🏠",
      version: "1.0.0",
      description: "Documentação oficial das rotas para gestão imobiliária Multi-tenant.",
      contact: { name: "Yara Enterprise Support" }
    },
    servers: [{ url: `http://localhost:${env.PORT}${env.API_PREFIX}/${env.API_VERSION}` }],
  },
  // O Swagger agora busca em todos os módulos de forma inteligente
  apis: ["./src/modules/**/infra/http/routes/*.ts", "./src/shared/infra/http/*.ts"], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

/**
 * 🛡️ SEGURANÇA E PERFORMANCE
 */
app.set("trust proxy", 1); // Essencial para capturar IP real em proxies como Render/Cloudflare
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression()); // Compacta as respostas para economizar banda (SaaS Grade)
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

/**
 * ⚙️ MIDDLEWARES BASE
 */
app.use(requestIdMiddleware); // Rastreia cada requisição com um ID único
app.use(express.json({ limit: "10mb" })); // Suporte a payloads maiores (fotos/documentos)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * 🔐 CORS (Usando a sua config personalizada da Yara Enterprise)
 */
app.use(cors(corsOptions));

/**
 * 🚀 ROTAS E DOCUMENTAÇÃO
 */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health Check - Para monitoramento de uptime
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: "online", 
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV 
  });
});

// Todas as rotas de negócio (Imóveis, Usuários, etc)
app.use(env.API_PREFIX, apiRouter);

/**
 * 🚨 TRATAMENTO DE ERROS (Sempre por último)
 */
app.use(errorMiddleware);

export { app };