import { Router } from "express";
/** * ✅ No padrão NodeNext, imports locais devem terminar em .js mesmo o arquivo físico sendo .ts.
 */
import * as tenantController from "../controllers/tenant.controller.js";

// ✅ Usando os Path Aliases configurados no seu tsconfig.json
import { protect } from "@shared/middlewares/auth.middleware.js";
import { upload } from "@shared/middlewares/upload.middleware.js"; 

const router = Router();

/**
 * 🔐 Camada de Proteção Global
 * Garante que apenas usuários autenticados acessem a base de inquilinos.
 */
router.use(protect);

/**
 * 👥 Rotas de Coleção
 */
router
  .route("/")
  .get(
    // Lista apenas inquilinos vinculados ao admin logado (Multi-tenancy)
    tenantController.listTenants
  )
  .post(
    // Upload de múltiplos documentos (ex: RG, CPF, Comprovante)
    upload.array("documents", 5), 
    tenantController.createTenant
  );

/**
 * 🔍 Rotas por ID
 */
router
  .route("/:id")
  .get(tenantController.getTenant)
  .patch(
    upload.array("documents", 5), 
    tenantController.updateTenant
  )
  .delete(
    // Operação crítica de exclusão (Cybersecurity: Recomenda-se Log de auditoria aqui)
    tenantController.deleteTenant
  );

export default router;