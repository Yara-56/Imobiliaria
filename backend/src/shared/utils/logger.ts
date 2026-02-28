import pino, { type Logger, type LoggerOptions } from "pino";
// ✅ IMPORTANTE: Se o env.ts estiver em src/config/env.ts
// O caminho saindo de shared/utils para config é exatamente ../../config/env.js
import { env } from "../../config/env.js";

const pinoOptions: LoggerOptions = {
  // O TS só vai reconhecer NODE_ENV se o seu arquivo env.ts exportar exatamente esse nome
  level: env.NODE_ENV === "development" ? "debug" : "info",
};

if (env.NODE_ENV === "development") {
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