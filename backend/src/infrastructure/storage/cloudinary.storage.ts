// CAMINHO: backend/src/infrastructure/storage/cloudinary.storage.ts
import { v2 as cloudinary } from "cloudinary";
// CORREÇÃO: Adicionada a extensão .js para o NodeNext localizar o arquivo vizinho
import { StorageProvider } from "./storage.interface.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryStorage implements StorageProvider {
  // Tipagem adicionada para evitar erros de 'any' implícito
  async upload({ file, filename, folder }: { file: Buffer; filename: string; folder: string }) {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: filename,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(file);
    });

    return {
      url: result.secure_url,
      key: result.public_id,
    };
  }
}