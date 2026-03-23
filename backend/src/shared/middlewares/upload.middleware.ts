// CAMINHO: backend/src/shared/middlewares/upload.middleware.ts
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import type { Request } from "express";

import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";

/**
 * 📁 Pasta local onde os documentos dos imóveis serão salvos
 * Ex.: backend/uploads/properties
 */
const propertyUploadsDir = path.resolve(process.cwd(), "uploads", "properties");

/**
 * Garante que a pasta exista
 */
fs.mkdirSync(propertyUploadsDir, { recursive: true });

/**
 * Extrai uma extensão segura a partir do arquivo original.
 * Se não conseguir, tenta pelo mimetype.
 */
const getSafeExtension = (file: Express.Multer.File) => {
  const originalExt = path.extname(file.originalname || "").toLowerCase();

  if (originalExt) return originalExt;

  const mimeToExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
  };

  return mimeToExt[file.mimetype] || "";
};

/**
 * Gera um nome único para evitar colisão de arquivos
 */
const generateFileName = (file: Express.Multer.File) => {
  const uniqueId = crypto.randomUUID();
  const ext = getSafeExtension(file);

  return `${uniqueId}${ext}`;
};

/**
 * Configuração do Multer para salvar em disco
 */
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, propertyUploadsDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, generateFileName(file));
  },
});

/**
 * 🛡️ Filtro de Segurança
 * Aceita apenas imagens e PDFs.
 */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedMimetypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(
    new AppError({
      message: "Arquivo inválido. Envie apenas imagens (JPG, PNG, WebP) ou PDF.",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  );
};

const uploadConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por arquivo
    files: 10,
  },
});

/**
 * Upload de documentos do imóvel
 * O campo no multipart/form-data deve se chamar "documents".
 */
export const uploadPropertyDocs = uploadConfig.array("documents", 10);

/**
 * Export útil para montar fileUrl/storageKey depois no controller/service
 */
export { propertyUploadsDir };