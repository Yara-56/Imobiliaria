import multer from "multer";
import { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";

/**
 * 📦 STORAGE EM MEMÓRIA
 * Ideal para Cloudinary e ambientes efêmeros (SaaS).
 */
const storage = multer.memoryStorage();

const allowedMimetypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

/** * 🔍 FILTRO DE SEGURANÇA
 */
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Formato de arquivo inválido. Use JPG, PNG, WEBP ou PDF.", HttpStatus.BAD_REQUEST));
  }
};

/**
 * ⚙️ CONFIGURAÇÃO DO ENGINE
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * 🚀 WRAPPER MIDDLEWARE (Nível Sênior)
 * Resolve o problema de tratamento de erros do Multer e padroniza a saída.
 */
export const uploadDocuments: RequestHandler = (req, res, next) => {
  // Nome do campo esperado no FormData: "images" ou "documents"
  // Recomendo usar "images" se for o que você definiu nas rotas antes
  const middleware = upload.array("images", 10); 

  middleware(req, res, (err: any) => {
    if (err) {
      // Erros lançados manualmente no fileFilter
      if (err instanceof AppError) {
        return next(err);
      }

      // Erros nativos do Multer (ex: arquivo muito grande)
      if (err instanceof multer.MulterError) {
        let message = `Erro no upload: ${err.message}`;
        
        if (err.code === 'LIMIT_FILE_SIZE') message = "Arquivo muito grande. Máximo 10MB.";
        if (err.code === 'LIMIT_UNEXPECTED_FILE') message = "Campo de upload inválido ou excesso de arquivos.";

        return next(new AppError(message, HttpStatus.BAD_REQUEST));
      }

      // Erros genéricos
      return next(new AppError("Falha inesperada no processamento dos arquivos.", HttpStatus.INTERNAL_SERVER_ERROR));
    }

    return next();
  });
};