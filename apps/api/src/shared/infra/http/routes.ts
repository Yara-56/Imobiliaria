import { Router, Request, Response, NextFunction } from "express";

// --- IMPORTAÇÃO DOS MÓDULOS ---
// ✅ Importante: Usando .ts para compatibilidade total com seu ambiente TSX/ESM
import authRoutes from "../../../modules/auth/routes/auth.routes.ts";
import tenantRoutes from "../../../modules/tenants/presentation/routes/tenant.routes.ts";
import propertyRoutes from "../../../modules/properties/routes/property.routes.ts";
import contractRoutes from "../../../modules/contracts/routes/contract.routes.ts";
import paymentRoutes from "../../../modules/payments/presentation/routes/payment.routes.ts";

export const apiRouter = Router();

/**
 * 📦 API VERSIONING (v1)
 */
const v1 = Router();

/**
 * 🧪 Health Check
 * Nível SaaS: Essencial para monitoramento e Load Balancers (AWS/Render)
 */
v1.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "HomeFlux API",
    version: "v1",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

/**
 * 🔐 Registro de Módulos
 */
v1.use("/auth", authRoutes);
v1.use("/tenants", tenantRoutes);
v1.use("/properties", propertyRoutes);
v1.use("/contracts", contractRoutes);
v1.use("/payments", paymentRoutes);

/**
 * 🚀 Registro da Versão no Roteador Principal
 */
apiRouter.use("/v1", v1);

/**
 * 🔍 404 - Route Not Found
 * Nível SaaS: Evita que o usuário receba uma página HTML vazia
 */
apiRouter.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    message: `A rota [${_req.method}] ${_req.originalUrl} não existe nesta API.`,
    docs: "https://api.homeflux.com.br/docs" // Dica: coloque o link da sua doc aqui
  });
});

/**
 * 🚨 Global Error Handler
 * Nível SaaS: Captura erros não tratados e responde de forma elegante
 */
apiRouter.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🚨 API Error:", err.message);
  
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});