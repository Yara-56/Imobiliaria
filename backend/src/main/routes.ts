import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import propertyRoutes from "../modules/properties/routes/property.routes.js";
import contractRoutes from "../modules/contracts/routes/contract.routes.js";
import paymentRoutes from "../modules/payments/routes/payment.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);       
apiRouter.use("/properties", propertyRoutes); 
apiRouter.use("/contracts", contractRoutes);   
apiRouter.use("/payments", paymentRoutes);