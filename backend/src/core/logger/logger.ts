import pino, { Logger as PinoLogger } from 'pino';
import path from 'path';
import fs from 'fs';

// Criar diretório de logs se não existir
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuração base do Pino
const pinoConfig = {
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings: any) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        environment: process.env.NODE_ENV,
      };
    },
  },
  serializers: {
    req: (req: any) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
      requestId: req.requestId,
    }),
    res: (res: any) => ({
      statusCode: res.statusCode,
      headers: res.getHeaders?.(),
    }),
    err: pino.stdSerializers.err,
  },
};

// Configuração de transporte
const transport = pino.transport({
  targets: [
    // Console em desenvolvimento
    ...(process.env.NODE_ENV !== 'production'
      ? [
          {
            level: 'debug',
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
              singleLine: false,
              messageFormat: '{levelLabel} [{context}] {msg}',
            },
          },
        ]
      : []),
    // Arquivo de logs em produção
    ...(process.env.NODE_ENV === 'production'
      ? [
          {
            level: 'info',
            target: 'pino/file',
            options: {
              destination: path.join(logsDir, 'app.log'),
            },
          },
          {
            level: 'error',
            target: 'pino/file',
            options: {
              destination: path.join(logsDir, 'error.log'),
            },
          },
        ]
      : []),
  ],
});

// Criar logger base
const baseLogger: PinoLogger = pino(pinoConfig, transport);

/**
 * Classe Logger com métodos helpers e suporte a Request ID
 */
export class Logger {
  private context: string;
  private logger: PinoLogger;

  constructor(context: string) {
    this.context = context;
    this.logger = baseLogger.child({ context });
  }

  /**
   * Log de informação
   */
  info(message: string, data?: any): void {
    this.logger.info(data, message);
  }

  /**
   * Log de aviso
   */
  warn(message: string, data?: any): void {
    this.logger.warn(data, message);
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error | any, data?: any): void {
    if (error instanceof Error) {
      this.logger.error({ err: error, ...data }, message);
    } else {
      this.logger.error({ error, ...data }, message);
    }
  }

  /**
   * Log de debug
   */
  debug(message: string, data?: any): void {
    this.logger.debug(data, message);
  }

  /**
   * Log de trace
   */
  trace(message: string, data?: any): void {
    this.logger.trace(data, message);
  }

  /**
   * Log de fatal
   */
  fatal(message: string, error?: Error | any, data?: any): void {
    if (error instanceof Error) {
      this.logger.fatal({ err: error, ...data }, message);
    } else {
      this.logger.fatal({ error, ...data }, message);
    }
  }

  /**
   * Log de requisição HTTP
   */
  logRequest(method: string, url: string, statusCode: number, duration: number, data?: any): void {
    this.logger.info(
      {
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        ...data,
      },
      'HTTP Request'
    );
  }

  /**
   * Log de erro de requisição HTTP
   */
  logRequestError(method: string, url: string, statusCode: number, error: Error, data?: any): void {
    this.logger.error(
      {
        method,
        url,
        statusCode,
        err: error,
        ...data,
      },
      'HTTP Request Error'
    );
  }

  /**
   * Log de operação de banco de dados
   */
  logDatabase(operation: string, table: string, duration: number, data?: any): void {
    this.logger.debug(
      {
        operation,
        table,
        duration: `${duration}ms`,
        ...data,
      },
      'Database Operation'
    );
  }

  /**
   * Log de erro de banco de dados
   */
  logDatabaseError(operation: string, table: string, error: Error, data?: any): void {
    this.logger.error(
      {
        operation,
        table,
        err: error,
        ...data,
      },
      'Database Error'
    );
  }

  /**
   * Log de performance
   */
  logPerformance(operation: string, duration: number, threshold?: number): void {
    const level = threshold && duration > threshold ? 'warn' : 'debug';
    this.logger[level](
      {
        operation,
        duration: `${duration}ms`,
        slow: threshold && duration > threshold,
      },
      'Performance'
    );
  }

  /**
   * Log de autenticação
   */
  logAuth(action: string, userId?: string, success: boolean = true, data?: any): void {
    this.logger.info(
      {
        action,
        userId,
        success,
        ...data,
      },
      'Authentication'
    );
  }

  /**
   * Log de autorização
   */
  logAuthorization(action: string, userId: string, resource: string, allowed: boolean, data?: any): void {
    const level = allowed ? 'debug' : 'warn';
    this.logger[level](
      {
        action,
        userId,
        resource,
        allowed,
        ...data,
      },
      'Authorization'
    );
  }

  /**
   * Retornar logger Pino para uso direto se necessário
   */
  getPinoLogger(): PinoLogger {
    return this.logger;
  }
}

// Exportar logger singleton para uso direto
export const logger = baseLogger;

// Exportar factory para criar loggers com contexto
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};

export default logger;