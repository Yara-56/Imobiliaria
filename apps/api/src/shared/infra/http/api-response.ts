export class ApiResponse {
    static success<T>(data: T, results?: number) {
      return {
        status: "success",
        data,
        ...(results !== undefined && { results }),
      };
    }
  
    static error(message: string) {
      return {
        status: "error",
        message,
      };
    }
  }