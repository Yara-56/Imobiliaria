import { Router } from "express";
import { tenantController } from "../controllers/tenant.controller.js";
import { protect } from "../../../../shared/middlewares/auth.middleware.js";

const router = Router();

// Protege todas as rotas abaixo
router.use(protect);

// 📦 CRUD - Inquilinos
router.get("/", tenantController.findAll);
router.get("/:id", tenantController.findById);
router.post("/", tenantController.create);
router.patch("/:id", tenantController.update);
router.delete("/:id", tenantController.delete);

/**
 * ❤️ Operações de Verificação
 * Se o TS reclamar, use (req, res) => tenantController.healthCheck(req, res)
 */
router.get("/health-check/status", (req, res) => tenantController.healthCheck(req, res));

export default router;