import { Router } from "express";
import * as propertyController from "../controllers/property.controller.js";

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
 * 🔒 Todas as rotas exigem autenticação
 */
router.use(protect);

/**
 * 🏠 Rotas de coleção
 */
router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(
    authorize("admin", "corretor"),
    uploadPropertyDocs,
    parseJsonFields(["documentsMeta"]),
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
    uploadPropertyDocs,
    parseJsonFields(["documentsMeta"]),
    validate(updatePropertySchema),
    propertyController.updateProperty
  )
  .delete(
    authorize("admin"),
    validate(getPropertySchema),
    propertyController.deleteProperty
  );

export default router;