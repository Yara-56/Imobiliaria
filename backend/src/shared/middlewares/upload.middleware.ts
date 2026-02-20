import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// ✅ Garante que a estrutura de pastas existe na raiz do backend
const tenantsUploadDir = path.resolve("uploads", "tenants");
const propertiesUploadDir = path.resolve("uploads", "properties");

if (!fs.existsSync(tenantsUploadDir)) fs.mkdirSync(tenantsUploadDir, { recursive: true });
if (!fs.existsSync(propertiesUploadDir)) fs.mkdirSync(propertiesUploadDir, { recursive: true });

// ✅ Função para gerar filename seguro e único
const makeFilename = (file: Express.Multer.File) => {
  const uniqueSuffix = crypto.randomBytes(4).toString("hex");
  const ext = path.extname(file.originalname);
  const name = path
    .basename(file.originalname, ext)
    .replace(/\s+/g, "_")
    .toLowerCase();

  return `${Date.now()}-${uniqueSuffix}-${name}${ext}`;
};

// ✅ Filtro de Segurança (Apenas o que uma imobiliária real usa)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["application/pdf", "image/jpeg", "image/png"];

  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Formato inválido. A AuraImobi aceita apenas PDF, JPG e PNG.") as any);
};

// ✅ Upload para TENANTS (mantém como está, mas organizado)
const tenantsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tenantsUploadDir),
  filename: (_req, file, cb) => cb(null, makeFilename(file)),
});

// ✅ Upload para PROPERTIES (novo)
const propertiesStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, propertiesUploadDir),
  filename: (_req, file, cb) => cb(null, makeFilename(file)),
});

export const uploadTenant = multer({
  storage: tenantsStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadProperty = multer({
  storage: propertiesStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ✅ Exports semânticos para as rotas
export const uploadTenantDocs = uploadTenant.array("documents", 5);
export const uploadPropertyDocs = uploadProperty.array("documents", 10);
