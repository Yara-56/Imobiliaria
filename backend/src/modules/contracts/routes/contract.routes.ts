import { Router } from "express";
import {
  getContracts,
  createContract,
  getContractById,
  updateContractStatus,
  deleteContract,
} from "../controllers/contract.controller.js";
import { protect } from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getContracts);
router.post("/", createContract);
router.get("/:id", getContractById);
router.patch("/:id/status", updateContractStatus); // ✅ patch para atualizar só o status
router.delete("/:id", deleteContract);

export default router;