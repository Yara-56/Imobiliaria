// CAMINHO REAL: backend/src/modules/tenants/routes/tenant.routes.ts
import { Router } from "express";
import { tenantController } from "../controllers/tenant.controller.js";

/** * ✅ CORREÇÃO DO RASTRO (Path):
 * 1. ../ (sai de routes)
 * 2. ../ (sai de tenants)
 * 3. ../ (sai de modules) 
 * Agora você está em 'src', onde pode acessar 'shared'.
 */
import { protect } from "../../../../shared/middlewares/auth.middleware.js";

const router = Router();

// 🛡️ Segurança: Protege todas as rotas de Tenant da Imobiliária Lacerda
router.use(protect);

router.post("/", tenantController.create);
router.get("/", tenantController.findAll);
router.get("/:id", tenantController.findById);
router.put("/:id", tenantController.update);
router.delete("/:id", tenantController.delete);

export default router;