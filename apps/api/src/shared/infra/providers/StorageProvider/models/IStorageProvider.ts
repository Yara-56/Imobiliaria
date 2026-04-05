/**
 * 🛠️ Contrato de Storage (SaaS Grade)
 * Define como qualquer serviço de armazenamento de arquivos deve se comportar.
 */
export interface IStorageProvider {
     /**
      * Realiza o upload de um arquivo para o provedor de nuvem.
      * @param file Buffer do arquivo (vinda do Multer ou stream)
      * @param folder Pasta de destino (ex: 'properties', 'avatars')
      * @returns URL pública e segura do arquivo armazenado
      */
     upload(file: Buffer, folder: string): Promise<string>;
   
     /**
      * Remove um arquivo do provedor de nuvem.
      * @param fileIdentifier URL completa ou Public ID do arquivo
      */
     delete(fileIdentifier: string): Promise<void>;
   }