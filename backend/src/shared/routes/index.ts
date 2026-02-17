import { Router } from "express";

import authRoutes from "../../modules/auth/auth.routes";
import propertyRoutes from "../../modules/properties/property.routes";
import tenantRoutes from "../../modules/tenants/tenant.routes";
import contractRoutes from "../../modules/contracts/contract.routes";
import paymentRoutes from "../../modules/payments/payment.routes";

import { protect } from "../middlewares/auth.middleware";

// ✅ Exportando como constante nomeada
export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);

// Proteção global para as rotas abaixo
apiRouter.use(protect); 

apiRouter.use("/properties", propertyRoutes);
apiRouter.use("/tenants", tenantRoutes);
apiRouter.use("/contracts", contractRoutes);
apiRouter.use("/payments", paymentRoutes);