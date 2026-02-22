import { Router } from "express";
import tenantRoutes from "./presentation/routes/tenant.routes.js";

export function registerTenantModule(app: Router) {
  app.use("/tenants", tenantRoutes);
}