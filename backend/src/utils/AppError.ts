/**
 * Custom application error class for operational errors.
 * These are expected errors (bad input, unauthorized, not found, etc.)
 * as opposed to programming bugs.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype);

    // Capture stack trace (excluding constructor)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factory methods
export const BadRequestError = (message = 'Bad request') =>
  new AppError(message, 400);

export const UnauthorizedError = (message = 'Unauthorized') =>
  new AppError(message, 401);

export const ForbiddenError = (message = 'Forbidden') =>
  new AppError(message, 403);

export const NotFoundError = (message = 'Resource not found') =>
  new AppError(message, 404);

export const ConflictError = (message = 'Conflict') =>
  new AppError(message, 409);
