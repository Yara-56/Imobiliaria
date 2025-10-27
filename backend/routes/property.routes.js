// backend/routes/property.routes.js
import express from "express";
import multer from "multer";
import * as controller from "../controllers/property.controller.js";

// Cria um roteador Express
const router = express.Router();

// Configuração básica do Multer (salva arquivos em /uploads)
const upload = multer({ dest: "uploads/" });

/**
 * Middleware que aplica o Multer **apenas se** o Content-Type for multipart/form-data.
 * Assim, as requisições JSON simples continuam funcionando normalmente.
 */
function maybeMulter(req, res, next) {
  const ct = (req.headers["content-type"] || "").toLowerCase();
  if (ct.startsWith("multipart/form-data")) {
    // Aplica o middleware de upload (aceita vários arquivos no campo "documents[]")
    return upload.array("documents[]")(req, res, next);
  }
  // Se não for multipart, segue direto
  return next();
}

// =========================================================
// 🚀 MODO DEV — sem autenticação
// =========================================================

// Listar imóveis + filtros/paginação
router.get("/", controller.listProperties);

// Buscar imóvel por ID
router.get("/:id", controller.getPropertyById);

// Criar imóvel (aceita JSON ou multipart com documentos)
router.post("/", maybeMulter, controller.createProperty);

// Atualizar imóvel parcialmente (aceita JSON ou multipart)
router.patch("/:id", maybeMulter, controller.updateProperty);

// Adicionar documentos a um imóvel existente
router.post("/:id/documents", maybeMulter, controller.addPropertyDocuments);

// Remover documento específico de um imóvel
router.delete("/:id/documents/:docId", controller.removePropertyDocument);

// Remover (deletar) imóvel completo
router.delete("/:id", controller.removeProperty);

// =========================================================
// 🔒 MODO PROD — quando o login/autenticação voltar
// =========================================================
/*
import auth from "../middlewares/auth.middleware.js";

// Listar imóveis
router.get("/", auth, controller.listProperties);

// Buscar imóvel por ID
router.get("/:id", auth, controller.getPropertyById);

// Criar imóvel (com upload opcional)
router.post("/", auth, maybeMulter, controller.createProperty);

// Atualizar imóvel parcialmente
router.patch("/:id", auth, maybeMulter, controller.updateProperty);

// Adicionar documentos
router.post("/:id/documents", auth, maybeMulter, controller.addPropertyDocuments);

// Remover documento específico
router.delete("/:id/documents/:docId", auth, controller.removePropertyDocument);

// Deletar imóvel
router.delete("/:id", auth, controller.removeProperty);
*/

// Exporta o router para uso no server.js
export default router;
