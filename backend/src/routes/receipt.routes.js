import express from "express";
// 1. Importa as funções diretamente do controller
import {
  listReceipts,
  createReceipt,
} from "../controllers/receipt.controller.js";
// 2. Importa o middleware de segurança com o nome correto
import { verifyToken } from "../src/middlewares/auth.middleware.js";

const router = express.Router();

// 3. Aplica a segurança a todas as rotas deste arquivo com o nome correto
router.use(verifyToken);

// 4. As chamadas ficam mais diretas e agora estão protegidas
router.get("/", listReceipts);
router.post("/", createReceipt);

export default router;
