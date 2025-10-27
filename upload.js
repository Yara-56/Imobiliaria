// backend/middlewares/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define o diretório de destino: um nível acima do middlewares, na pasta 'uploads'
const uploadDir = path.join(__dirname, "..", "uploads");

// 2. Bloco para garantir que o diretório exista
if (!fs.existsSync(uploadDir)) {
  // Cria o diretório de forma síncrona (blocking)
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`[Multer] Diretório de upload criado: ${uploadDir}`);
} else {
  console.log(`[Multer] Diretório de upload já existe: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define o destino dos arquivos
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Cria um nome de arquivo único: nomeOriginal-timestamp.extensao
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

// Configura o Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
  fileFilter: (req, file, cb) => {
    // Aceita apenas arquivos PDF e imagens
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Formato de arquivo não suportado. Use PDF ou Imagem."),
        false
      );
    }
  },
});

// **********************************************
// 🚀 CORREÇÃO APLICADA AQUI: mudou de "documents" para "documents[]"
// **********************************************
// Exporta o Multer configurado. O campo 'documents[]' deve ser o nome usado no FormData do frontend.
export const uploadTenantDocs = upload.array("documents[]");

// Adicional: exporta a instância raw do Multer para uso em rotas específicas (como a de PUT)
export default upload;
