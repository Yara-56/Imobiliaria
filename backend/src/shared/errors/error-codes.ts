export const ErrorCodes = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    CONFLICT: "CONFLICT",
    INTERNAL_ERROR: "INTERNAL_ERROR",
  } as const;
  
  export type ErrorCode =
    (typeof ErrorCodes)[keyof typeof ErrorCodes];