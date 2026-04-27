import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('formats a whole number', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats a number with cents', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('adds thousands separator for large amounts', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });

  it('rounds to two decimal places', () => {
    expect(formatCurrency(9.999)).toBe('$10.00');
  });

  it('formats negative amounts', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });

  it('formats a fractional cent correctly', () => {
    expect(formatCurrency(0.1 + 0.2)).toBe('$0.30');
  });
});
