import pino, { type LoggerOptions } from "pino";
import { env } from "../../config/env.js";

/**
 * Configuração base do logger
 */
const options: LoggerOptions = {
  level: env.NODE_ENV === "development" ? "debug" : "info",

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
};

/**
 * Transport apenas em desenvolvimento
 * (pretty logs)
 */
if (env.NODE_ENV === "development") {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
    },
  };
}

export const logger = pino(options);

export default logger;