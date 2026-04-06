import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

/**
 * Send a standardized success response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

/**
 * Send a standardized error response.
 */
export function sendError(
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: string[],
): void {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  res.status(statusCode).json(response);
}
