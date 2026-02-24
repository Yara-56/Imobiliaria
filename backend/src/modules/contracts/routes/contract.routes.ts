import { Router } from "express";
import {
  listContracts,
  createContract,
  getContractById,
  updateContract,
} from "../controllers/contract.controller.js"; 
import { protect } from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", listContracts);
router.post("/", createContract);
router.get("/:id", getContractById);
router.put("/:id", updateContract);

export default router;