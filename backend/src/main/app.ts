import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Importações internas
import { apiRouter } from "./routes.js";
import { HttpStatus } from "../shared/errors/http-status.js";
import { AppError } from "../shared/errors/AppError.js";

const app: Application = express();

/**
 * 🌐 Trust proxy (necessário para SaaS em cloud)
 */
app.set("trust proxy", 1);

/**
 * 📚 Swagger Definition
 */
const specs = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ImobiSys API",
      version: "1.0.0",
      description: "SaaS de Gestão Imobiliária - Projeto Imobiliária Lacerda",
    },
    servers: [
      {
        url: "http://localhost:3001/api/v1",
      },
    ],
  },
  apis: ["./src/modules/**/*.ts", "./dist/modules/**/*.js"],
});

/**
 * 🛡️ Security Middlewares
 */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/**
 * 🔓 CORS (Ajustado para aceitar as portas do seu Vite)
 * Liberamos a 5173 e a 5174 para evitar o erro "Origin not allowed"
 */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * 📝 Logs de requisição
 */
app.use(morgan("dev"));

/**
 * 📦 Body parsers (limite de 10mb para fotos de documentos)
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * 📖 Documentação Swagger
 */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * 🚀 API v1 - Rotas principais
 */
app.use("/api/v1", apiRouter);

/**
 * ❌ Fallback para rotas inexistentes
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

/**
 * 🚨 Error Handler Centralizado (O "Cérebro" do tratamento de erros)
 */
app.use(
  (err: any, req: Request, res: Response, _next: NextFunction) => {
    // Erros conhecidos da aplicação (ex: CPF duplicado, campos vazios)
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
        errorCode: err.errorCode,
      });
    }

    // Log detalhado no console para o desenvolvedor
    console.error("🔥 INTERNAL ERROR:", err);

    // Erros desconhecidos (ex: banco fora do ar)
    const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      status: "error",
      message: "Erro interno no servidor do ImobiSys",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Contate o suporte técnico",
    });
  }
);

export { app };