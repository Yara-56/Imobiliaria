import 'reflect-metadata'; // Necessário para o tsyringe (Injeção de Dependência)
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Importações usando a nova estrutura de pastas
import { env } from "@config/env.js";
import { corsOptions } from "@config/cors.config.js";
import { apiRouter } from "./routes.js";
import { errorMiddleware } from "../../middlewares/error.middleware.js"; 
import { requestIdMiddleware } from "../../middlewares/request-id.middleware.js";

// Inicializa o Container de Injeção de Dependência (ESM: import de pasta não é válido em Node)
import "@shared/container/index.js";

const app: Application = express();

const httpDir = path.dirname(fileURLToPath(import.meta.url));
/** Raiz `src` ou `dist` (três níveis acima de shared/infra/http) */
const srcDir = path.join(httpDir, "../../..");
const toPosixGlob = (p: string) => p.replace(/\\/g, "/");

/**
 * Em dev (tsx) os ficheiros são `.ts`; em prod (`node dist/...`) são `.js`.
 * Globs só com `.ts` não encontram nada em dist → Swagger vazio ("No operations defined").
 */
const isCompiledBundle = /[/\\]dist[/\\]/.test(httpDir);
const routeGlobExt = isCompiledBundle ? "js" : "ts";

/**
 * 📖 CONFIGURAÇÃO DO SWAGGER — globs relativos a este ficheiro (independente do cwd)
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
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "API HomeFlux (paths absolutos desde a raiz)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    toPosixGlob(path.join(srcDir, `modules/**/*.routes.${routeGlobExt}`)),
    toPosixGlob(path.join(httpDir, `routes.${routeGlobExt}`)),
    toPosixGlob(path.join(httpDir, `app.${routeGlobExt}`)),
  ],
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

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Sistema]
 *     summary: Health check (raiz)
 *     description: Uptime do processo, sem prefixo /api.
 *     responses:
 *       200:
 *         description: Servidor online
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: online }
 *                 timestamp: { type: string, format: date-time }
 *                 environment: { type: string }
 */
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