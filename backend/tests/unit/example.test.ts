import {
  BCRYPT_SALT_ROUNDS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PASSWORD_MIN_LENGTH,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
} from '../../src/utils/constants';

describe('Application constants', () => {
  it('BCRYPT_SALT_ROUNDS is a secure value (>= 10)', () => {
    expect(BCRYPT_SALT_ROUNDS).toBeGreaterThanOrEqual(10);
  });

  it('DEFAULT_PAGE_SIZE is less than MAX_PAGE_SIZE', () => {
    expect(DEFAULT_PAGE_SIZE).toBeLessThan(MAX_PAGE_SIZE);
  });

  it('PASSWORD_MIN_LENGTH enforces a minimum secure length', () => {
    expect(PASSWORD_MIN_LENGTH).toBeGreaterThanOrEqual(8);
  });

  it('NAME_MIN_LENGTH is less than NAME_MAX_LENGTH', () => {
    expect(NAME_MIN_LENGTH).toBeLessThan(NAME_MAX_LENGTH);
  });
});
