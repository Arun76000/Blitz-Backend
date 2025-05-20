export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  flag: boolean;
  timestamp: string;
  path?: string;
  details?: Record<string, any>;
}

export class ApiException extends Error {
  public readonly statusCode: number;
  public readonly error: string;
  public readonly details: Record<string, any>;
  public readonly flag: boolean;

  constructor(
    message: string,
    statusCode: number,
    error: string,
    flag: boolean,
    details?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.flag = flag;
    this.details = details || {};
    this.name = "ApiException";
  }

  // Factory methods for common HTTP errors
  static badRequest(
    message = "Bad Request",
    details?: Record<string, any>
  ): ApiException {
    return new ApiException(message, 400, "BadRequest", false, details);
  }

  static unauthorized(
    message = "Unauthorized",
    details?: Record<string, any>
  ): ApiException {
    return new ApiException(message, 401, "Unauthorized", false, details);
  }

  static forbidden(
    message = "Forbidden",
    details?: Record<string, any>
  ): ApiException {
    return new ApiException(message, 403, "Forbidden", false, details);
  }

  static notFound(
    message = "Not Found",
    details?: Record<string, any>
  ): ApiException {
    return new ApiException(message, 404, "NotFound", false, details);
  }

  static internalServerError(
    message = "Internal Server Error",
    details?: Record<string, any>
  ): ApiException {
    return new ApiException(message, 500, "InternalServerError", false, details);
  }

  // Format the error response
  toResponse(path?: string): ApiError {
    return {
      statusCode: this.statusCode,
      message: this.message,
      error: this.error,
      flag: this.flag,
      timestamp: new Date().toISOString(),
      path,
      details: this.details,
    };
  }
}
