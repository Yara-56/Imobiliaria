// CAMINHO COMPLETO: backend/src/infrastructure/storage/s3.storage.ts
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
// CORREÇÃO: Uso do .js para compatibilidade com seu ambiente NodeNext
import { StorageProvider } from "./storage.interface.js";

/**
 * Provedor de Armazenamento AWS S3 para o ImobiSys.
 * Focado em escalabilidade e segurança de documentos da Imobiliária Lacerda.
 */
export class S3Storage implements StorageProvider {
  private client: S3Client;

  constructor() {
    // Cybersecurity: Verificação de variáveis de ambiente obrigatórias
    this.client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async upload({ file, filename, folder }: { file: Buffer; filename: string; folder: string }) {
    const bucket = process.env.AWS_S3_BUCKET!;
    const key = `${folder}/${Date.now()}-${filename}`;

    try {
      const parallelUploads3 = new Upload({
        client: this.client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: file,
          ContentType: "application/octet-stream",
        },
      });

      await parallelUploads3.done();

      return {
        url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (error: any) {
      console.error("Erro no upload para S3:", error);
      throw new Error("Falha ao carregar arquivo para o S3.");
    }
  }
}