import "reflect-metadata";
import "@/shared/container/index.js";
import { config } from "dotenv";
import path from "node:path";

// Carrega o .env único que está na raiz da pasta api
config({
  path: path.resolve(process.cwd(), ".env"),
});

console.log("✅ [Bootstrap] Variáveis de ambiente carregadas.");