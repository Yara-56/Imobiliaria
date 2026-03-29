export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  CONFLICT: "CONFLICT",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY", // Adicionado para o TenantService
  INTERNAL_ERROR: "INTERNAL_ERROR",
  FILE_UPLOAD_ERROR: "FILE_UPLOAD_ERROR", // Adicionado para o módulo de Properties
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];