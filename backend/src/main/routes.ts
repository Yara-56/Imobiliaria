// backend/src/main/routes.ts
import { Router } from "express";

import authRoutes from "../modules/auth/routes/auth.routes.js";
import propertyRoutes from "../modules/properties/routes/property.routes.js";
import contractRoutes from "../modules/contracts/routes/contract.routes.js";
import paymentRoutes from "../modules/payments/routes/payment.routes.js";
import tenantRoutes from "../modules/tenants/presentation/routes/tenant.routes.js";

export const apiRouter = Router();

/**
 * 🔐 Módulos da API v1
 * Ordem lógica de domínio
 */

apiRouter.use("/auth", authRoutes);
apiRouter.use("/tenants", tenantRoutes); // ✅ ESSENCIAL
apiRouter.use("/properties", propertyRoutes);
apiRouter.use("/contracts", contractRoutes);
apiRouter.use("/payments", paymentRoutes);

/**
 * 🧪 Health check da API (PRO)
 */
apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ImobiSys API",
    version: "v1",
    timestamp: new Date().toISOString(),
  });
});