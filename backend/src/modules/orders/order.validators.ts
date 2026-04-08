import { CreateOrderInput } from './order.types';
import { BadRequestError } from '../../utils/AppError';

export function validateCreateOrderInput(input: CreateOrderInput): void {
  if (!input.dropId || typeof input.dropId !== 'string') {
    throw BadRequestError('A valid dropId is required');
  }

  if (input.quantity !== undefined && (input.quantity < 1 || !Number.isInteger(input.quantity))) {
    throw BadRequestError('Quantity must be a positive integer');
  }
}
