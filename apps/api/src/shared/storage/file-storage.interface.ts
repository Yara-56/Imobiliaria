/**
 * Contrato de upload de ficheiros (S3, Cloudinary, etc.).
 */
export interface IFileStorage {
  upload(file: Buffer | string, key: string): Promise<string>;
}

