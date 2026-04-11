/**
 * ✅ RASTRO PROFISSIONAL:
 * Centralização de Status Codes seguindo a RFC 7231.
 * O uso de 'as const' garante que o TypeScript trate os valores como literais imutáveis.
 */
export const HttpStatus = {
  // Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413, // Essencial para uploads
  UNPROCESSABLE_ENTITY: 422,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504, // 💡 Resolvendo o erro anterior
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];