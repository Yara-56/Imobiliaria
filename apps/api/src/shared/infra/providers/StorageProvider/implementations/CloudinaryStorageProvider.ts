import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { env } from '../../../../../config/env.js';
import { IStorageProvider } from '../models/interfaces/IStorageProvider.js';
import { AppError } from '../../../../errors/AppError.js';
import { HttpStatus } from '../../../../errors/http-status.js';

export class CloudinaryStorageProvider implements IStorageProvider {
  /**
   * ✅ SEGURANÇA: Configurações de upload imutáveis para evitar sobrescrita
   */
  private readonly defaultOptions: Partial<UploadApiOptions> = {
    resource_type: 'auto',
    unique_filename: true,
    overwrite: false, // Protege contra colisões de nome de arquivo
  };

  async upload(file: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // ⏱️ TIMEOUT: Se o upload demorar mais de 30s, abortamos para não travar a RAM
      const timeout = setTimeout(() => {
        reject(new AppError({
          message: "Tempo limite de upload excedido (Timeout).",
          statusCode: HttpStatus.GATEWAY_TIMEOUT
        }));
      }, 30000);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          ...this.defaultOptions,
          folder: `${env.CLOUDINARY_FOLDER_PREFIX}/${folder}`,
        },
        (error, result) => {
          clearTimeout(timeout);

          if (error) {
            console.error(`[CLOUDINARY ERROR]: ${error.message}`);
            return reject(new AppError({
              message: "Falha na comunicação com o servidor de mídia.",
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            }));
          }

          if (!result?.secure_url) {
            return reject(new AppError({
              message: "Resposta inválida do servidor de imagens.",
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            }));
          }

          resolve(result.secure_url);
        }
      );

      // Inicia a transmissão dos dados
      uploadStream.end(file);
    });
  }

  /**
   * ✅ RESILIÊNCIA: Deleta por Public ID ou URL completa
   */
  async delete(fileIdentifier: string): Promise<void> {
    try {
      // Extrai o public_id se o input for uma URL completa
      const publicId = this.extractPublicId(fileIdentifier);
      
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(result.result);
      }
    } catch (error) {
      // Em deletes, apenas logamos o erro para não quebrar o fluxo principal
      // mas mantemos o rastro para limpeza manual posterior.
      console.error(`[CLEANUP ERROR]: Falha ao remover arquivo ${fileIdentifier}`, error);
    }
  }

  /**
   * 🛡️ HELPER: Extrai o publicId de uma URL do Cloudinary com segurança
   */
  private extractPublicId(url: string): string {
    if (!url.includes('cloudinary.com')) return url;
    
    // Remove o domínio e a extensão para pegar o caminho relativo (Pasta/Nome)
    const parts = url.split('/');
    const lastPart = parts.pop() || '';
    const folderParts = parts.slice(parts.indexOf('upload') + 2); // Pula a versão e o tipo
    
    const fileName = lastPart.split('.')[0];
    return [...folderParts, fileName].join('/');
  }
}