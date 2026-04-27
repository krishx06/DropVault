import { validateCreateOrderInput } from '../../src/modules/orders/order.validators';
import { AppError } from '../../src/utils/AppError';

describe('validateCreateOrderInput', () => {
  it('accepts a valid dropId with no quantity', () => {
    expect(() => validateCreateOrderInput({ dropId: 'drop-123' })).not.toThrow();
  });

  it('accepts a valid dropId with a positive integer quantity', () => {
    expect(() => validateCreateOrderInput({ dropId: 'drop-123', quantity: 5 })).not.toThrow();
  });

  it('throws when dropId is missing', () => {
    expect(() => validateCreateOrderInput({ dropId: '' })).toThrow(AppError);
  });

  it('throws when dropId is not a string', () => {
    expect(() => validateCreateOrderInput({ dropId: 123 as unknown as string })).toThrow(AppError);
  });

  it('throws when quantity is zero', () => {
    expect(() => validateCreateOrderInput({ dropId: 'drop-123', quantity: 0 })).toThrow(AppError);
  });

  it('throws when quantity is negative', () => {
    expect(() => validateCreateOrderInput({ dropId: 'drop-123', quantity: -1 })).toThrow(AppError);
  });

  it('throws when quantity is a float', () => {
    expect(() => validateCreateOrderInput({ dropId: 'drop-123', quantity: 1.5 })).toThrow(AppError);
  });

  it('includes a descriptive message on dropId error', () => {
    try {
      validateCreateOrderInput({ dropId: '' });
    } catch (err) {
      expect((err as AppError).message).toMatch(/dropId/i);
    }
  });

  it('includes a descriptive message on quantity error', () => {
    try {
      validateCreateOrderInput({ dropId: 'drop-123', quantity: -3 });
    } catch (err) {
      expect((err as AppError).message).toMatch(/quantity/i);
    }
  });
});
