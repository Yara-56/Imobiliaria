import { Router } from "express";
import { tenantController } from "../controllers/tenant.controller.js";
import { protect } from "../../../../shared/middlewares/auth.middleware.js";

const router = Router();

/**
 * 🛡️ Middlewares de Proteção
 * Garante que apenas usuários logados acessem as rotas de inquilinos
 */
router.use(protect);

/**
 * 📦 CRUD - Inquilinos (Tenants)
 */

// Listar todos os inquilinos da imobiliária logada
router.get("/", (req, res, next) => tenantController.findAll(req, res, next));

// Buscar detalhes de um inquilino específico
router.get("/:id", (req, res, next) => tenantController.findById(req, res, next));

// Criar novo inquilino (vinculado automaticamente ao tenantId do usuário)
router.post("/", (req, res, next) => tenantController.create(req, res, next));

// Atualizar dados do inquilino (PATCH ou PUT)
router.patch("/:id", (req, res, next) => tenantController.update(req, res, next));

// Remover inquilino do sistema
router.delete("/:id", (req, res, next) => tenantController.delete(req, res, next));

/**
 * ❤️ Operações de Verificação
 */

// Rota de Health Check que o seu Frontend utiliza para validar o status
router.get("/:id/health", (req, res) => tenantController.healthCheck(req, res));

export default router;