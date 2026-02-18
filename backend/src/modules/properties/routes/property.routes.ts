import { Router } from "express";
// ✅ IMPORTANTE: Em NodeNext, importe de .js mesmo o arquivo sendo .ts
import * as propertyController from "../controllers/property.controller.js";
import { protect, authorize } from "@shared/middlewares/auth.middleware.js";
import { validate } from "@shared/middlewares/validate.middleware.js";
import {
  createPropertySchema,
  updatePropertySchema,
  getPropertySchema,
} from "../schemas/property.schema.js";

const router = Router();

/**
 * 🔒 Camada de Proteção Global
 * Garante que ninguém acesse os imóveis sem um token JWT válido.
 */
router.use(protect);

/**
 * 🏠 Rotas de Coleção
 */
router
  .route("/")
  .get(
    // Clientes, corretores e admins podem visualizar a lista
    propertyController.getAllProperties
  )
  .post(
    // Restrito a quem opera a imobiliária
    authorize("admin", "corretor"),
    validate(createPropertySchema),
    propertyController.createProperty
  );

/**
 * 🔍 Rotas por ID
 */
router
  .route("/:id")
  .get(
    validate(getPropertySchema), 
    propertyController.getPropertyById
  )
  .patch(
    authorize("admin", "corretor"),
    validate(updatePropertySchema),
    propertyController.updateProperty
  )
  .delete(
    // Segurança máxima: Apenas o dono/admin da imobiliária remove registros
    authorize("admin"),
    validate(getPropertySchema),
    propertyController.deleteProperty
  );

export default router;