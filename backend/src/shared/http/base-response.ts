export interface ApiMeta {
    page?: number;
    limit?: number;
    total?: number;
    requestId?: string;
    timestamp?: string;
    path?: string;
  }
  
  export interface ApiError {
    code?: string;
    details?: any;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: ApiMeta;
    error?: ApiError;
  }
  
  export class BaseResponse {
    static success<T>(
      data: T,
      message?: string,
      meta?: ApiMeta
    ): ApiResponse<T> {
      return {
        success: true,
        message,
        data,
        meta,
      };
    }
  
    static error(
      message: string,
      error?: ApiError,
      meta?: ApiMeta
    ): ApiResponse {
      return {
        success: false,
        message,
        error,
        meta,
      };
    }
  
    static paginated<T>(
      data: T[],
      page: number,
      limit: number,
      total: number,
      message?: string,
      meta?: ApiMeta
    ): ApiResponse<T[]> {
      return {
        success: true,
        message,
        data,
        meta: {
          ...meta,
          page,
          limit,
          total,
        },
      };
    }
  }