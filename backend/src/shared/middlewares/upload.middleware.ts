import multer from "multer";
import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../errors/http-status.js";
import { Request } from "express";

const storage = multer.memoryStorage();

const allowedMimetypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError({
        message: "Arquivo inválido. Apenas JPG, PNG, WEBP ou PDF.",
        statusCode: HttpStatus.BAD_REQUEST,
      })
    );
  }
};

export const uploadDocuments = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).array("documents", 10);