import fs from "fs";
import path from "path";
import { IFileStorage } from "./file-storage.interface.js";

export class LocalFileStorage implements IFileStorage {
  private uploadDir = path.resolve("uploads");

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir);
    }
  }

  async upload(file: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filePath, file);

    return `http://localhost:3333/uploads/${filename}`;
  }
}