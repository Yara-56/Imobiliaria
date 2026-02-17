import { Router } from "express";
import * as tenantController from "./tenant.controller.ts";
import { protect } from "../../shared/middlewares/auth.middleware.ts";
import { upload } from "../../shared/middlewares/upload.middleware.ts"; // Se estiver usando Multer

const router = Router();

router.use(protect); // Proteção global para as rotas de inquilinos

router.route("/")
  .get(tenantController.listTenants)
  .post(upload.array("documents", 5), tenantController.createTenant); // Permite até 5 documentos

router.route("/:id")
  .get(tenantController.getTenant)
  .patch(upload.array("documents", 5), tenantController.updateTenant)
  .delete(tenantController.deleteTenant);

export default router; // ✅ Exportação padrão para o apiRouter reconhecer