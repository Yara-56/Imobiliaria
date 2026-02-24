// backend/src/modules/tenants/routes/tenant.routes.ts
import { Router } from "express";
import { tenantController } from "../controllers/tenant.controller.js";
import { protect } from "../../../../shared/middlewares/auth.middleware.js";

const router = Router();

/**
 * 🛡️ Todas as rotas protegidas
 */
router.use(protect);

/**
 * 📦 CRUD — Tenants
 */

// CREATE
router.post("/", tenantController.create);

// READ ALL
router.get("/", tenantController.findAll);

// READ BY ID
router.get("/:id", tenantController.findById);

// UPDATE (✅ alinhado com frontend PATCH)
router.patch("/:id", tenantController.update);

// DELETE
router.delete("/:id", tenantController.delete);

/**
 * ❤️ Health do tenant (frontend usa)
 */
router.get("/:id/health", tenantController.healthCheck);

export default router;