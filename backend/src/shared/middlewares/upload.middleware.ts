// CAMINHO: backend/src/shared/middlewares/upload.middleware.ts
import multer from "multer";
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";

/**
 * Configuração do Multer para o ImobiSys
 */
const storage = multer.memoryStorage();

/**
 * 🛡️ Filtro de Segurança (Cybersecurity)
 * Impede o upload de scripts maliciosos, aceitando apenas imagens e PDFs.
 */
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimetypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError({ 
      message: "Arquivo inválido. Envie apenas imagens (JPG, PNG, WebP) ou PDF.", 
      statusCode: HttpStatus.BAD_REQUEST 
    }), false);
  }
};

const uploadConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB por arquivo
  },
});

/**
 * ✅ CORREÇÃO TS2305: Exportando com o nome exato que o Router espera.
 * O campo no formulário (multipart/form-data) deve se chamar "documents".
 */
export const uploadPropertyDocs = uploadConfig.array("documents", 10);