import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// ✅ Garante que a estrutura de pastas existe na raiz do backend
const uploadDir = path.resolve("uploads", "tenants");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configuração de Armazenamento Inteligente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Cria um sufixo único (ex: 1708123456-a1b2c3-documento.pdf)
    const uniqueSuffix = crypto.randomBytes(4).toString("hex");
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/\s+/g, "_") // Remove espaços para evitar bugs em URLs
      .toLowerCase();
    
    cb(null, `${Date.now()}-${uniqueSuffix}-${name}${ext}`);
  },
});

// ✅ Filtro de Segurança (Apenas o que uma imobiliária real usa)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["application/pdf", "image/jpeg", "image/png"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Resolvendo o erro ts(2345) com uma instância de erro limpa
    cb(new Error("Formato inválido. A AuraImobi aceita apenas PDF, JPG e PNG.") as any);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB por arquivo
  },
});

// ✅ Exportação com nome semântico para as rotas
export const uploadTenantDocs = upload.array("documents", 5);