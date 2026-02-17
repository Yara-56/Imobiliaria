import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Caminho baseado na sua árvore de diretórios
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      // ✅ CORREÇÃO: casting para 'any' resolve o erro ts(2345) da sua imagem
      cb(new Error("Formato não suportado. Use PDF ou Imagem.") as any, false);
    }
  },
});

// ✅ Exportação sincronizada com o seu comentário na imagem
export const uploadTenantDocs = upload.array("documents[]");