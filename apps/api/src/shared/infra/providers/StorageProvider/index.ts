import { container } from "tsyringe";
import type { IStorageProvider } from "./models/interfaces/IStorageProvider.js";
import { CloudinaryStorageProvider } from "./implementations/CloudinaryStorageProvider.js";

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  CloudinaryStorageProvider
);

export { CloudinaryStorageProvider };
export type { IStorageProvider };
