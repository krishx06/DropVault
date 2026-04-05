import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('formats numbers to USD currency correctly', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});
