import { Router } from "express";
import { protect } from "@/shared/middlewares/auth.middleware";
import { validateContractCreation } from "../presentation/validators/contract.validator.js";
import { ContractController } from "../controllers/ContractController.js";

const router = Router();
const controller = new ContractController();

// 🔐 Proteção global (JWT + tenantId + RBAC opcional)
router.use(protect);

/**
 * ==========================================================
 *  🔵 FLUXO DO MÓDULO CONTRACTS
 * ==========================================================
 */

// GET /contracts → Lista todos os contratos do tenant
router.get("/", controller.getAll.bind(controller));

// POST /contracts → Cria contrato completo
router.post(
  "/",
  validateContractCreation,
  controller.create.bind(controller)
);

// GET /contracts/:id → Detalhes do contrato
router.get("/:id", controller.getById.bind(controller));

// PATCH /contracts/:id/status → Atualiza status
router.patch("/:id/status", controller.updateStatus.bind(controller));

// DELETE /contracts/:id → Remove contrato
router.delete("/:id", controller.delete.bind(controller));

export default router;