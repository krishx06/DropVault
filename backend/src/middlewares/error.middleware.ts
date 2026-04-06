import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware.
 * Must be registered LAST in the Express middleware chain.
 *
 * Handles:
 * - AppError (operational errors with known status codes)
 * - Prisma known request errors (unique constraint, not found)
 * - Unknown/unexpected errors (500)
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // --- Operational errors (thrown intentionally) ---
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode });
    sendError(res, err.message, err.statusCode);
    return;
  }

  // --- Prisma unique constraint violation ---
  if (err.constructor?.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as { code?: string; meta?: { target?: string[] } };
    if (prismaErr.code === 'P2002') {
      const field = prismaErr.meta?.target?.[0] ?? 'field';
      logger.warn(`Prisma unique constraint violation on: ${field}`);
      sendError(res, `A record with this ${field} already exists`, 409);
      return;
    }
    if (prismaErr.code === 'P2025') {
      logger.warn('Prisma record not found');
      sendError(res, 'Record not found', 404);
      return;
    }
  }

  // --- Prisma validation error ---
  if (err.constructor?.name === 'PrismaClientValidationError') {
    logger.error('Prisma validation error', { message: err.message });
    sendError(res, 'Invalid data provided', 400);
    return;
  }

  // --- JWT errors ---
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401);
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401);
    return;
  }

  // --- Unknown errors (bugs, infrastructure failures) ---
  logger.error('Unhandled error', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  sendError(res, 'Internal server error', 500);
}
