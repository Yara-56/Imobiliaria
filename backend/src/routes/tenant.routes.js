// backend/routes/tenant.routes.js

import express from "express";
import {
  listTenants,
  createTenant,
  getTenant,
  updateTenant,
  deleteTenant,
} from "../controllers/tenant.controller.js";

// Middleware de upload (Multer)
import upload from "../src/middlewares/upload.middleware.js";

const router = express.Router();

// =========================================================
// 🚀 ROTAS PARA INQUILINOS (MODO DEV / sem autenticação)
// =========================================================

// Listar todos os inquilinos
router.get("/", listTenants);

// Criar um novo inquilino com upload de arquivos
router.post("/", upload.array("documents[]", 5), createTenant);

// Obter detalhes de um inquilino específico
router.get("/:id", getTenant);

// Atualizar inquilino com upload de arquivos
router.put("/:id", upload.array("documents[]", 5), updateTenant);

// Deletar inquilino
router.delete("/:id", deleteTenant);

export default router;
