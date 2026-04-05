/**
 * 📦 Centralização das configurações da aplicação
 * 
 * Este arquivo funciona como um "hub" de configuração,
 * permitindo importar tudo de um único lugar.
 */

import { env } from "./env.js";
import { appConfig } from "./app.config.js";
import { databaseConfig } from "./database.config.js";
import { securityConfig } from "./security.config.js";

/**
 * Configuração global da aplicação
 */
export const config = {
  env,
  app: appConfig,
  database: databaseConfig,
  security: securityConfig,
} as const;

/**
 * Re-exportações individuais (opcional)
 * Permite importar direto se necessário
 */
export { env } from "./env.js";
export { appConfig } from "./app.config.js";
export { databaseConfig } from "./database.config.js";
export { securityConfig } from "./security.config.js";