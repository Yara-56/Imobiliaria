import { env } from "./env.js";

/**
 * ⚙️ Configurações principais da aplicação
 */
export const appConfig = {
  name: "ImobiSys",

  env: env.NODE_ENV,

  port: env.PORT,

  frontendUrl: env.FRONTEND_URL,
} as const;