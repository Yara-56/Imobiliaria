import { createLogger as createPinoLogger } from "../../utils/logger/logger.js";

/**
 * Logger HTTP leve — usado por `httpLogger.middleware.ts` nesta pasta.
 */
export function createLogger(scope: string) {
  return createPinoLogger(scope);
}
