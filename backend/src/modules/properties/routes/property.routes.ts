// CAMINHO: backend/src/modules/properties/routes/property.routes.ts
import { Router } from "express";
import * as propertyController from "../controllers/PropertiesController";

/** * ✅ RASTRO PROFISSIONAL:
 * Sincronizado para acessar os middlewares globais na pasta shared.
 */
import { protect, authorize } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { parseJsonFields } from "../../../shared/middlewares/parseJsonFields.middleware.js";
import { uploadPropertyDocs } from "../../../shared/middlewares/upload.middleware.js";

import {
  createPropertySchema,
  updatePropertySchema,
  getPropertySchema,
} from "../schemas/property.schema.js";

const router = Router();

/**
 * 🔒 Cybersecurity: Bloqueio total para usuários não autenticados.
 * Isso evita que o controlador tente ler 'req.user.tenantId' de um objeto vazio.
 */
router.use(protect);

/**
 * 🏠 Rotas de Coleção (Listagem e Cadastro)
 */
router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(
    authorize("admin", "corretor"),
    uploadPropertyDocs,           // Processa imagens/documentos
    parseJsonFields(["address"]), // Converte strings JSON para objetos TS
    validate(createPropertySchema), // Valida o contrato de dados
    propertyController.createProperty
  );

/**
 * 🔍 Rotas por ID (Detalhes, Edição e Exclusão)
 */
router
  .route("/:id")
  .get(validate(getPropertySchema), propertyController.getPropertyById)
  .patch(
    authorize("admin", "corretor"),
    uploadPropertyDocs,
    parseJsonFields(["address"]),
    validate(updatePropertySchema),
    propertyController.updateProperty
  )
  .delete(
    authorize("admin"), // Apenas admin pode excluir dados da Imobiliária Lacerda
    validate(getPropertySchema),
    propertyController.deleteProperty
  );

export default router;