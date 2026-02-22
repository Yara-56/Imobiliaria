import { Router } from "express";
// ✅ IMPORTANTE: Em NodeNext, importe de .js mesmo o arquivo sendo .ts
import {
  listContracts,
  createContract,
  getContractById,
  updateContract,
} from "../controllers/contract.controller.js"; 
import { protect } from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

/**
 * 🛡️ CAMADA DE PROTEÇÃO (Cybersecurity)
 * Garante que todas as operações de contrato exijam um token JWT válido.
 */
router.use(protect);

router.get("/", listContracts);
router.post("/", createContract);
router.get("/:id", getContractById);
router.put("/:id", updateContract);

export default router;