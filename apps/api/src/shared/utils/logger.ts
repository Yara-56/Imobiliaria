import pino from "pino";
import { env, isDev } from "../../config/env.js";

/**
 * Configuração base do logger
 */
const baseConfig: pino.LoggerOptions = {

  level: isDev ? "debug" : env.LOG_LEVEL ?? "info",

  base: {
    service: "imobisys-api",
    environment: env.NODE_ENV,
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  formatters: {
    level(label) {
      return { level: label };
    },
  },

  redact: {
    paths: [
      "req.headers.authorization",
      "password",
      "token",
      "refreshToken",
    ],
    remove: true,
  },

};

/**
 * Logger para desenvolvimento
 * (logs bonitos no terminal)
 */
const devLogger = pino({
  ...baseConfig,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
      singleLine: false,
    },
  },
});

/**
 * Logger para produção
 * (logs JSON estruturados)
 */
const prodLogger = pino(baseConfig);

/**
 * Exporta logger correto baseado no ambiente
 */
export const logger = isDev ? devLogger : prodLogger;

export default logger;