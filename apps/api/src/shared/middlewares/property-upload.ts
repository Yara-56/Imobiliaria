import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/properties';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(8).toString('hex');
    const name = `${hash}-${file.originalname.replace(/\s/g, '_')}`;
    cb(null, name);
  }
});

export const propertyUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Apenas arquivos PDF são permitidos') as any, false);
    }
    cb(null, true);
  }
});