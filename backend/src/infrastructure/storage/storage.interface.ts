export interface StorageProvider {
    upload(params: {
      file: Buffer
      filename: string
      folder: string
    }): Promise<{
      url: string
      key: string
    }>
  }