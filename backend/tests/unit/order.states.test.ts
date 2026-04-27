import { canTransition } from '../../src/modules/orders/order.states';

describe('canTransition', () => {
  describe('from PENDING', () => {
    it('allows PENDING → CONFIRMED', () => {
      expect(canTransition('PENDING', 'CONFIRMED')).toBe(true);
    });

    it('allows PENDING → CANCELLED', () => {
      expect(canTransition('PENDING', 'CANCELLED')).toBe(true);
    });

    it('allows PENDING → FAILED', () => {
      expect(canTransition('PENDING', 'FAILED')).toBe(true);
    });

    it('rejects PENDING → PENDING', () => {
      expect(canTransition('PENDING', 'PENDING')).toBe(false);
    });
  });

  describe('from terminal states', () => {
    it('rejects CONFIRMED → CANCELLED', () => {
      expect(canTransition('CONFIRMED', 'CANCELLED')).toBe(false);
    });

    it('rejects CONFIRMED → PENDING', () => {
      expect(canTransition('CONFIRMED', 'PENDING')).toBe(false);
    });

    it('rejects CONFIRMED → FAILED', () => {
      expect(canTransition('CONFIRMED', 'FAILED')).toBe(false);
    });

    it('rejects CANCELLED → CONFIRMED', () => {
      expect(canTransition('CANCELLED', 'CONFIRMED')).toBe(false);
    });

    it('rejects FAILED → CONFIRMED', () => {
      expect(canTransition('FAILED', 'CONFIRMED')).toBe(false);
    });
  });
});
