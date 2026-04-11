import { Router } from "express";
import { protect } from "@/shared/middlewares/auth.middleware.js";
import { validateContractCreation } from "../presentation/validators/contract.validator.js";
import { ContractController } from "../controllers/ContractController.js";

const router = Router();
const controller = new ContractController();

// 🔐 Proteção global (JWT + tenantId + RBAC opcional)
router.use(protect);

/**
 * @openapi
 * /api/v1/contracts:
 *   get:
 *     tags: [Contratos]
 *     summary: Listar contratos do tenant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista
 *   post:
 *     tags: [Contratos]
 *     summary: Criar contrato
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Criado
 */
router.get("/", controller.getAll.bind(controller));

router.post(
  "/",
  validateContractCreation,
  controller.create.bind(controller)
);

/**
 * @openapi
 * /api/v1/contracts/{id}:
 *   get:
 *     tags: [Contratos]
 *     summary: Detalhe do contrato
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contrato
 *   delete:
 *     tags: [Contratos]
 *     summary: Excluir contrato
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removido
 */
router.get("/:id", controller.getById.bind(controller));

/**
 * @openapi
 * /api/v1/contracts/{id}/status:
 *   patch:
 *     tags: [Contratos]
 *     summary: Atualizar status do contrato
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Atualizado
 */
router.patch("/:id/status", controller.updateStatus.bind(controller));

router.delete("/:id", controller.delete.bind(controller));

export default router;