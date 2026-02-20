import { Router } from "express";
// ✅ IMPORTANTE: Em NodeNext, importe de .js mesmo o arquivo sendo .ts
import * as propertyController from "../controllers/property.controller.js";

import { protect, authorize } from "@shared/middlewares/auth.middleware.js";
import { validate } from "@shared/middlewares/validate.middleware.js";

// ✅ NOVO: parse do address quando vier como JSON string via multipart
import { parseJsonFields } from "@shared/middlewares/parseJsonFields.middleware.js";

// ✅ NOVO: upload específico de documents para properties
import { uploadPropertyDocs } from "@shared/middlewares/upload.middleware.js";

import {
  createPropertySchema,
  updatePropertySchema,
  getPropertySchema,
} from "../schemas/property.schema.js";

const router = Router();

/**
 * 🔒 Camada de Proteção Global
 */
router.use(protect);

/**
 * 🏠 Rotas de Coleção
 */
router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(
    authorize("admin", "corretor"),

    // ✅ 1) multer popula req.body + req.files (multipart/form-data)
    uploadPropertyDocs,

    // ✅ 2) address chega como string -> vira objeto
    parseJsonFields(["address"]),

    // ✅ 3) valida body (zod)
    validate(createPropertySchema),

    // ✅ 4) controller salva tudo
    propertyController.createProperty
  );

/**
 * 🔍 Rotas por ID
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
    authorize("admin"),
    validate(getPropertySchema),
    propertyController.deleteProperty
  );

export default router;
