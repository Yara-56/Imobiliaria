export interface IFileStorage {
    upload(file: Buffer, filename: string): Promise<string>;
  }