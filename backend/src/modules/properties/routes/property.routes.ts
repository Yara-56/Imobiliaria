// backend/src/modules/properties/routes/property.routes.ts

import { Router } from "express";
import { propertyController } from "../controllers/PropertiesController.js";
import { protect, authorize } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { parseJsonFields } from "../../../shared/middlewares/parseJsonFields.middleware.js";
import { uploadDocuments } from "../../../shared/middlewares/upload.middleware.js";

import {
  createPropertySchema,
  updatePropertySchema,
  getPropertySchema,
} from "../schemas/property.schema.js";

const router = Router();

// Todos os imóveis exigem login
router.use(protect);

router
  .route("/")
  .get((req, res, next) => propertyController.getAll(req, res, next))
  .post(
    authorize("admin", "corretor"),
    uploadDocuments, // Multer processa os binários
    parseJsonFields(["address"]), // Converte string JSON em objeto
    validate(createPropertySchema), // Valida com Zod
    (req, res, next) => propertyController.create(req, res, next)
  );

router
  .route("/:id")
  .get(
    validate(getPropertySchema), 
    (req, res, next) => propertyController.getById(req, res, next)
  )
  .patch(
    authorize("admin", "corretor"),
    uploadDocuments,
    parseJsonFields(["address"]),
    validate(updatePropertySchema),
    (req, res, next) => propertyController.update(req, res, next)
  )
  .delete(
    authorize("admin"),
    validate(getPropertySchema),
    (req, res, next) => propertyController.delete(req, res, next)
  );

export default router;