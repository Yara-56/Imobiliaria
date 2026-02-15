import express from "express";
import {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
} from "../controllers/template.controller.js";
// CORREÇÃO: Importando a função com o nome correto
import { verifyToken } from "../src/middlewares/auth.middleware.js";

const router = express.Router();

// Aplica segurança a todas as rotas de templates
// CORREÇÃO: Usando a função com o nome correto
router.use(verifyToken);

// Define as rotas e associa cada uma à sua função no controller
router.get("/", listTemplates);
router.get("/:id", getTemplateById);
router.post("/", createTemplate);
router.put("/:id", updateTemplate);

export default router;
