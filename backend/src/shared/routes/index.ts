import { Router } from "express";

/**
 * ✅ No padrão NodeNext, imports de arquivos locais devem terminar em .js.
 * Os Path Aliases facilitam a manutenção e evitam erros de caminhos relativos.
 */
import authRoutes from "@modules/auth/routes/auth.routes.js";
import propertyRoutes from "@modules/properties/routes/property.routes.js";
import tenantRoutes from "@modules/tenants/routes/tenant.routes.js";
import contractRoutes from "@modules/contracts/routes/contract.routes.js";
import paymentRoutes from "@modules/payments/routes/payment.routes.js";

import { protect } from "@shared/middlewares/auth.middleware.js";

export const apiRouter = Router();

/**
 * 🔓 Rotas Públicas
 */
apiRouter.use("/auth", authRoutes);

/**
 * 🔐 Proteção de Camada (Middleware Global)
 * Garante que o usuário esteja logado antes de acessar os módulos abaixo.
 */
apiRouter.use(protect); 

/**
 * 🏢 Módulos de Negócio (Isolados por Multi-tenancy)
 */
apiRouter.use("/properties", propertyRoutes);
apiRouter.use("/tenants", tenantRoutes);
apiRouter.use("/contracts", contractRoutes);
apiRouter.use("/payments", paymentRoutes);