import { Router, Request, Response, NextFunction } from "express";

import authRoutes from "@modules/auth/routes/auth.routes.js";
import tenantRoutes from "@modules/tenants/presentation/routes/tenant.routes.js";
import propertyRoutes from "@modules/properties/routes/property.routes.js";
import contractRoutes from "@modules/contracts/routes/contract.routes.js";
import paymentRoutes from "@modules/payments/presentation/routes/payment.routes.js";

export const apiRouter = Router();

const v1 = Router();

v1.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "HomeFlux API",
    version: "v1",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

v1.use("/auth", authRoutes);
v1.use("/tenants", tenantRoutes);
v1.use("/properties", propertyRoutes);
v1.use("/contracts", contractRoutes);
v1.use("/payments", paymentRoutes);

apiRouter.use("/v1", v1);

apiRouter.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    message: `A rota [${req.method}] ${req.originalUrl} não existe nesta API.`,
  });
});

apiRouter.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("🚨 API Error:", err.message);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);