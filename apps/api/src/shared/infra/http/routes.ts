import { Router } from "express";

import authRoutes from "../../modules/auth/routes/auth.routes";
import tenantRoutes from "../../modules/tenants/presentation/routes/tenant.routes";
import propertyRoutes from "../../modules/properties/routes/property.routes";
import contractRoutes from "../../modules/contracts/routes/contract.routes";
import paymentRoutes from "../../modules/payments/presentation/routes/payment.routes";

export const apiRouter = Router();

/**
 * 📦 API VERSIONING
 */
const v1 = Router();

/**
 * 🔐 Módulos da API
 */
v1.use("/auth", authRoutes);
v1.use("/tenants", tenantRoutes);
v1.use("/properties", propertyRoutes);
v1.use("/contracts", contractRoutes);
v1.use("/payments", paymentRoutes);

/**
 * 🧪 Health Check
 */
v1.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "HomeFlux API",
    version: "v1",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * 🚀 Registrar versão
 */
apiRouter.use("/v1", v1);