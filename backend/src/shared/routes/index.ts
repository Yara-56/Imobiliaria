import { Router } from "express";
import authRoutes from "../../modules/auth/auth.routes.ts";
import propertyRoutes from "../../modules/properties/property.routes.ts";
import tenantRoutes from "../../modules/tenants/tenant.routes.ts";
import contractRoutes from "../../modules/contracts/contract.routes.ts";
import paymentRoutes from "../../modules/payments/payment.routes.ts"; // ✅ Novo módulo

const apiRouter = Router();

// 🔑 Segurança
apiRouter.use("/auth", authRoutes);

// 🏠 Gestão Imobiliária (AuraImobi)
apiRouter.use("/properties", propertyRoutes); // Imóveis
apiRouter.use("/tenants", tenantRoutes);       // Inquilinos
apiRouter.use("/contracts", contractRoutes);   // Contratos
apiRouter.use("/payments", paymentRoutes);     // Financeiro

export { apiRouter };