import pino, { type Logger, type LoggerOptions } from "pino";
import { env } from "../../config/env.js";

/**
 * 🛠️ AuraImobi Logger System
 * Resolvendo o erro de sobrecarga e 'exactOptionalPropertyTypes'
 */
const pinoOptions: LoggerOptions = {
  level: env.nodeEnv === "development" ? "debug" : "info",
};

// Só adicionamos o transport se estivermos em desenvolvimento
// Isso evita passar 'transport: undefined', que quebra a regra do TS
if (env.nodeEnv === "development") {
  pinoOptions.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  };
}

export const logger: Logger = pino(pinoOptions);

export default logger;