import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger/logger.js';
import { getRequestId } from '@infra/http/request-id.middleware.js';

const logger = createLogger('HTTPLogger');

/**
 * Middleware que registra todas as requisições HTTP
 * Integrado com Request ID para rastreamento
 */
export function httpLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = getRequestId(req);
  const startTime = Date.now();
  const { method, url, headers } = req;

  // Interceptar o método send para capturar a resposta
  const originalSend = res.send;

  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log da requisição
    if (statusCode >= 400) {
      // ✅ CORRIGIDO: Template string com backticks corretos
      logger.warn(`${method} ${url} - ${statusCode}`, {
        requestId,
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        userAgent: headers['user-agent'],
        ip: req.ip,
      });
    } else {
      // ✅ CORRIGIDO: Template string com backticks corretos
      logger.info(`${method} ${url} - ${statusCode}`, {
        requestId,
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        userAgent: headers['user-agent'],
        ip: req.ip,
      });
    }

    // Chamar o send original
    return originalSend.call(this, data);
  };

  next();
}