import express from "express";
// Importa as funções DIRETAMENTE do controller específico
import {
  listContracts,
  createContract,
  getContractById,
  updateContract,
} from "./contract.controller.js";
// CORREÇÃO: Importa o middleware de segurança com o nome correto
import { verifyToken } from "../src/middlewares/auth.middleware.js";

const router = express.Router();

// Aplica o middleware "verifyToken" a todas as rotas deste arquivo
router.use(verifyToken);

// As chamadas agora são diretas, limpas e protegidas
router.get("/", listContracts);
router.post("/", createContract);
router.get("/:id", getContractById);
router.put("/:id", updateContract);

export default router;
