// routes/property.routes.js
import express from 'express';
import * as propertyController from '../controllers/property.controller.js';
import { proteger } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET: Listar todos os imóveis (protegido)
router.get('/', proteger, propertyController.listProperties);

// POST: Criar novo imóvel (protegido)
router.post('/', proteger, propertyController.createProperty);

export default router;
