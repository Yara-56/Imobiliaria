// CAMINHO COMPLETO: backend/src/main/app.ts
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// ✅ Importação do rastro das rotas (estão na mesma pasta 'main')
import { apiRouter } from "./routes.js";
import { HttpStatus } from "../shared/errors/http-status.js";
import { AppError } from "../shared/errors/AppError.js";

const app: Application = express();

/**
 * 📚 Swagger Definition - Documentação Profissional
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
        url: "http://localhost:3001/api/v1", // ✅ Sincronizado com seus logs e testes
      },
    ],
  },
  // ✅ Rastro corrigido: sai de 'main' para varrer os módulos na 'src'
  apis: ["./src/modules/**/*.ts", "./src/modules/**/*.js"],
});

/**
 * 🛠️ Middlewares de Segurança (Cybersecurity)
 */
app.use(helmet()); // 🛡️ Adiciona headers de segurança (HSTS, CSP, etc)

/**
 * 🔓 Configuração de CORS CORRIGIDA
 * Resolve o erro: "Cannot use wildcard in Access-Control-Allow-Origin".
 */
app.use(cors({
  origin: "http://localhost:5173", // ✅ Permite apenas o seu Frontend
  credentials: true,               // ✅ Necessário para o envio do imobisys_token
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev")); // 📝 Auditoria: Loga todas as requisições no terminal
app.use(express.json()); // 📦 Parser para JSON

/**
 * 📖 Rotas & Documentação
 */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/v1", apiRouter); // ✅ Usando o prefixo de versão v1

/**
 * 🚨 Error Handling Centralizado Profissional
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Se for um erro conhecido do ImobiSys (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errorCode: err.errorCode
    });
  }

  // 🛡️ Erro inesperado: Logamos o erro real, mas não expomos detalhes sensíveis em prod
  console.error("🔥 INTERNAL ERROR:", err);
  
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Erro interno no servidor do ImobiSys",
    error: process.env.NODE_ENV === "development" ? err.message : "Contate o suporte"
  });
});

export { app };