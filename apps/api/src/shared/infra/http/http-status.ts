/**
 * Enum com todos os status codes HTTP
 * Referência: RFC 7231, RFC 7232, RFC 7233, RFC 7235
 */
export enum HttpStatus {
  // 2xx Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,

  // 3xx Redirection
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,

  // 4xx Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  GONE = 410,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  // 5xx Server Error
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * Mapa de mensagens padrão para cada status code
 */
export const HTTP_STATUS_MESSAGES: Record<HttpStatus, string> = {
  [HttpStatus.OK]: 'OK',
  [HttpStatus.CREATED]: 'Created',
  [HttpStatus.ACCEPTED]: 'Accepted',
  [HttpStatus.NO_CONTENT]: 'No Content',
  [HttpStatus.RESET_CONTENT]: 'Reset Content',
  [HttpStatus.PARTIAL_CONTENT]: 'Partial Content',
  [HttpStatus.MULTIPLE_CHOICES]: 'Multiple Choices',
  [HttpStatus.MOVED_PERMANENTLY]: 'Moved Permanently',
  [HttpStatus.FOUND]: 'Found',
  [HttpStatus.SEE_OTHER]: 'See Other',
  [HttpStatus.NOT_MODIFIED]: 'Not Modified',
  [HttpStatus.TEMPORARY_REDIRECT]: 'Temporary Redirect',
  [HttpStatus.PERMANENT_REDIRECT]: 'Permanent Redirect',
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.GONE]: 'Gone',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HttpStatus.NOT_IMPLEMENTED]: 'Not Implemented',
  [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
};

/**
 * Função helper para obter mensagem de status
 */
export const getStatusMessage = (status: HttpStatus): string => {
  return HTTP_STATUS_MESSAGES[status] || 'Unknown Status';
};

/**
 * Função helper para verificar se é erro 4xx
 */
export const isClientError = (status: HttpStatus): boolean => {
  return status >= 400 && status < 500;
};

/**
 * Função helper para verificar se é erro 5xx
 */
export const isServerError = (status: HttpStatus): boolean => {
  return status >= 500 && status < 600;
};

/**
 * Função helper para verificar se é sucesso 2xx
 */
export const isSuccess = (status: HttpStatus): boolean => {
  return status >= 200 && status < 300;
};