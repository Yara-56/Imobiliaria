import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../shared/http/httpLogger.js';

const logger = createLogger('RequestIdMiddleware');

/**
 * Estender o tipo Request do Express para incluir requestId
 */
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
    }
  }
}

/**
 * Middleware que gera um ID único para cada requisição
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Gerar UUID único para a requisição
    const requestId = uuid();

    // Adicionar ao objeto Request
    req.requestId = requestId;
    req.startTime = Date.now();

    // Adicionar ao header da resposta
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Request-Start-Time', new Date().toISOString());

    // Log da requisição iniciada
    logger.debug('Requisição iniciada', {
      requestId,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Interceptar o método send para capturar a resposta
    const originalSend = res.send;

    res.send = function (data: any) {
      const duration = Date.now() - req.startTime;
      const statusCode = res.statusCode;

      // Log da requisição finalizada
      if (statusCode >= 400) {
        logger.warn('Requisição finalizada com erro', {
          requestId,
          method: req.method,
          url: req.url,
          statusCode,
          duration: `${duration}ms`,
          ip: req.ip,
        });
      } else {
        logger.info('Requisição finalizada com sucesso', {
          requestId,
          method: req.method,
          url: req.url,
          statusCode,
          duration: `${duration}ms`,
          ip: req.ip,
        });
      }

      // Chamar o send original
      return originalSend.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Erro ao processar Request ID Middleware', error as Error);
    next();
  }
};

/**
 * ✅ EXPORTAR: Função helper para obter o Request ID do contexto
 */
export const getRequestId = (req: Request): string => {
  return req.requestId || 'unknown';
};

/**
 * ✅ EXPORTAR: Função helper para adicionar Request ID aos logs
 */
export const withRequestId = (req: Request, data?: any) => {
  return {
    requestId: getRequestId(req),
    ...data,
  };
};